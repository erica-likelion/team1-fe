/* 사전 문진 정보 입력 페이지 (생년월일) */

//import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router";
import TextButton from "../../components/commons/TextButton";
import TextField from "../../components/forms/TextField";
import TitleBlock from "../../components/commons/TitleBlock";
import WhiteChevronRight from "@assets/images/white_chevron_right.svg";


const AgePage = () => {
    // const { t } = useTranslation();
    const [birthDate, setBirthDate] = useState('');

    const navigate = useNavigate(); 

    const canMoveNextStep = birthDate !== '';

    const handleNext = () => {
        console.log('birthDate:', birthDate);
        navigate('/treat-info-form/country')
    };

    return (
        <div className="p-5">
            <TitleBlock
                title = "당신은 언제 태어났나요?"
                subtitle = "생년월일을 8자리로 입력해주세요."
            />
            <div className="mt-13">
                <TextField
                    type="date"
                    value={birthDate}
                    onChange={setBirthDate}
                    placeholder="YYYY.MM.DD"
                />
            </div>
            

            <TextButton
                text="입력하기"
                onClick={handleNext}
                disabled={!canMoveNextStep}
                icon={WhiteChevronRight}
            />
            
        
        </div>
    );
};

export default AgePage;