import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Document from "@assets/images/document.svg";

const PrescriptionUploadPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleCameraCapture = () => {
        // 카메라 촬영 로직 (네이티브 카메라 앱으로 이동)
        // 실제 구현시에는 카메라 권한 및 이미지 캡처 처리
        console.log("카메라 촬영 시작");
        
        // 촬영 완료 후 스캔 중 페이지로 이동
        setTimeout(() => {
            navigate('/prescription/scanning');
        }, 1000);
    };

    const handleGallerySelect = () => {
        // 갤러리에서 선택 로직
        console.log("갤러리에서 선택");
        
        // 선택 완료 후 스캔 중 페이지로 이동
        setTimeout(() => {
            navigate('/prescription/scanning');
        }, 1000);
    };

    return (
        <div className="flex flex-col px-5 pt-3.25 gap-6">
            <div className="flex flex-col justify-center items-center gap-3 w-full max-w-[335px] h-[225px] bg-[#3DE0AB08] border-2 border-dashed border-[#3DE0AB] rounded-[4px] mb-8">
                <img src={Document}/>
                <p className="text-sm text-gray-500 text-center">
                    {t('prescription.upload.description')}
                </p>
            </div>

            <div className="space-y-3">
                <button 
                    onClick={handleCameraCapture}
                    className="w-full py-4 bg-green-500 text-white font-medium rounded-lg flex items-center justify-center gap-2"
                >
                    <span>📷</span>
                    {t('prescription.buttons.camera')}
                </button>
                
                <button 
                    onClick={handleGallerySelect}
                    className="w-full py-4 border border-green-500 text-green-500 font-medium rounded-lg flex items-center justify-center gap-2"
                >
                    <span>🖼️</span>
                    {t('prescription.buttons.gallery')}
                </button>
            </div>
        </div>
    );
};

export default PrescriptionUploadPage;