import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTreatInfo } from "@contexts/TreatInfoContext";
import { useUser } from "@contexts/UserContext";
import TextButton from "@components/commons/TextButton";
import TextField from "@components/forms/TextField";

import GreenChevronRight from "@assets/images/green_chevron_right.svg";

const TreantInfoResultPage = () => {

    const {t} = useTranslation();
    const navigate = useNavigate();
    const { user } = useUser();
    const { result, error, isLoading } = useTreatInfo();

    const handleNavigation = (path) => {
        console.log('작동 여부: O');
        navigate(path);
    }

    return (
        <div>
            <div className="flex flex-col justify-center items-center px-5 mt-15">
                <p className=" text-center text-xl font-semibold whitespace-pre-line">
                    {t('precheck.result.messageParts.part1')}
                    {user && <span className="text-[#3DE0AB] font-semibold">{user.name}</span>}
                    {t('precheck.result.messageParts.part2')}
                </p>
                <TextField
                    value={error ? `오류: ${error}` : result ? result.koreanContent || result.content : '로딩 중...'}
                    readOnly={true}
                    placeholder="AI 생성 텍스트"
                    maxLength={1000000}
                    height="h-[303px]"
                    multiline={true}
                    className ="mt-8"
                    />
                <button 
                    onClick={() => handleNavigation('/translate')}
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