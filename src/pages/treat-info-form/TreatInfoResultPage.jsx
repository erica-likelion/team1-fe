import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTreatInfo } from "@contexts/TreatInfoContext";
import { useUser } from "@contexts/UserContext";
import TextButton from "@components/commons/TextButton";
import TextField from "@components/forms/TextField";

import GreenChevronRight from "@assets/images/green_chevron_right.svg";

const TreantInfoResultPage = () => {

    const {t, i18n} = useTranslation();
    const navigate = useNavigate();
    const { user } = useUser();
    const { result, error, isLoading } = useTreatInfo();
    const [isTranslated, setIsTranslated] = useState(false);

    const handleNavigation = (path) => {
        console.log('번역 버튼 클릭됨, 현재 상태:', isTranslated);
        setIsTranslated(!isTranslated);
    }

    const handleTranslate = () => {
        setIsTranslated(!isTranslated);
    }

    const getDisplayText = () => {
        if (error) return `오류: ${error}`;
        if (!result) return '로딩 중...';

        console.log('현재 번역 상태:', isTranslated);
        console.log('사용 가능한 콘텐츠:', {
            content: result.content,
            koreanContent: result.koreanContent
        });
        
        // 현재 언어에 따라 표시할 텍스트 결정
        const currentLanguage = i18n.language;
        
        if (isTranslated) {
            // 번역된 텍스트 표시
            if (currentLanguage === 'ko') {
                return result.content || result.koreanContent; // 원문 (영어 또는 중국어)
            } else {
                return result.koreanContent || result.content; // 한글 번역본
            }
        } else {
            // 기본 텍스트 표시
            if (currentLanguage === 'ko') {
                return result.koreanContent || result.content;
            } else {
                return result.content || result.koreanContent;
            }
        }
    };

    const getTranslateButtonText = () => {
        const currentLanguage = i18n.language;
        
        if (currentLanguage === 'ko') {
            return isTranslated ? '한국어로' : '원문으로';
        } else {
            return isTranslated ? 'Original' : '한국어로';
        }
    };


    return (
        <div>
            <div className="flex flex-col justify-center items-center px-5 mt-15">
                <p className=" text-center text-xl font-semibold whitespace-pre-line">
                    {t('precheck.result.messageParts.part1')}
                    {user && <span className="text-[#3DE0AB] font-semibold">{user.name}</span>}
                    {t('precheck.result.messageParts.part2')}
                </p>
                <TextField
                    value={getDisplayText()}
                    readOnly={true}
                    placeholder="AI 생성 텍스트"
                    maxLength={1000000}
                    height="h-[303px]"
                    multiline={true}
                    className ="mt-8"
                    />
                <button 
                    onClick={handleTranslate} 
                    className="flex justify-center items-center 
                                font-regular rounded-sm 
                                bg-[#3DE0AB] text-white text-sm
                                w-[95px] h-[32px] mt-6 ml-60"
                >
                    번역하기
                </button>
            </div>

            <div className="relative">
                <TextButton
                    text = "병원 전화 에약하기"
                    onClick={() => handleNavigation('/hospital-booking')}
                    icon={GreenChevronRight}
                    className = "mb-15 bg-[#9DEECF] !text-[#00A270]"
                />
                <TextButton
                    text = "통역 채팅 시작하기"
                    onClick={() => handleNavigation('/chat')}
                    icon={GreenChevronRight}
                    className = "bg-[#9DEECF] !text-[#00A270]"
                />
            </div>
            
        </div>
    )

}

export default TreantInfoResultPage;