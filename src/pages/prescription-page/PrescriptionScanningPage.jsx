import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { getUserName } from "@utils/userUtils";
import { uploadPrescription } from "@apis/prescriptionApi";

// 테스트용 목업
import { mockUploadPrescription } from "@apis/prescriptionApi";

import Loading from "@assets/images/loading.svg";

const PrescriptionScanningPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const userName = getUserName();

    const { image } = location.state || {};
    const language = i18n.language;

    useEffect(() => {
        //데이터가 없으면 업로드 페이지로 리다이렉트
        if (!image) {
            navigate('/prescription/upload');
            return;
        }

        // API 통신 버전
        // const analyzePresc = async () => {
        //     try {
        //         const [result] = await Promise.all([
        //             uploadPrescription(language, image),
        //             new Promise(resolve => setTimeout(resolve, 2000))
        //         ]);

        //         navigate('/prescription/result', {
        //             state: {
        //                 analysisResult: result.content
        //             }
        //         })
        //     } catch (error) {
        //         console.error('처방전 분석 실패:', error);
        //         alert('처방전 분석에 실패했습니다. 다시 시도해주세요.');
        //         navigate('/prescription/upload');
        //     }
        // };


        // API 호출하여 처방전 분석
        const analyzePresc = async () => {
            try {
                // 최소 2초는 로딩 화면을 보여주기 위해 Promise.all 사용
                const [result] = await Promise.all([
                    mockUploadPrescription(language, image),
                    new Promise(resolve => setTimeout(resolve, 2000))
                ]);
                
                // 결과 페이지로 이동하며 데이터 전달
                navigate('/prescription/result', {
                    state: {
                        analysisResult: language==="ko" ? result.koreanContent : result.content
                    }
                });
            } catch (error) {
                console.error('처방전 분석 실패:', error);
                alert('처방전 분석에 실패했습니다. 다시 시도해주세요.');
                navigate('/prescription/upload');
            }
        };

        analyzePresc();
    }, []);


    return (
        <div className="flex flex-col items-center px-5 mt-25">
            <div className="text-center">
                <p className="text-xl font-semibold whitespace-pre-line">
                    {t('prescription.scanning.messageParts.part1')}
                    <span className="text-green-500 font-semibold">{userName}</span>
                    {t('prescription.scanning.messageParts.part2')}
                </p>
                
                <img src={Loading} className="animate-spin fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
                <p className="text-[#A6A9AA] font-semibold fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-18">
                    {t('prescription.scanning.wait')}
                </p>
            </div>
        </div>
    );
};

export default PrescriptionScanningPage;