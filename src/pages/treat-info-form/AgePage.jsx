/* 사전 문진 정보 입력 페이지 (생년월일) */

//import { useTranslation } from "react-i18next";
import { useState,useRef } from "react";
import { useNavigate } from "react-router";
import TextButton from "../../components/commons/TextButton";
import TextField from "../../components/forms/TextField";
import TitleBlock from "../../components/commons/TitleBlock";
import WhiteChevronRight from "@assets/images/white_chevron_right.svg";
import Calendar from "@assets/images/calendar.svg";


const AgePage = () => {
    // const { t } = useTranslation();
    const [birthDate, setBirthDate] = useState('');
    const inputRef = useRef(null);
    const navigate = useNavigate(); 

    const canMoveNextStep = birthDate !== '';

    const handleNext = () => {
        console.log('birthDate:', birthDate);
        navigate('/treat-info-form/country')
    };

    const openCalendar = () => {
        if (inputRef.current?.showPicker) {
            inputRef.current.showPicker();
        } else {
            inputRef.current?.focus();
        }
    };

    return (
        <div className="p-5">
            <TitleBlock
                title = "당신은 언제 태어났나요?"
                subtitle = "생년월일을 8자리로 입력해주세요."
            />
            <div className="mt-13 relative ">
                <TextField
                    ref = {inputRef}
                    type="date"
                    value={birthDate}
                    onChange={setBirthDate}
                    placeholder="YYYY.MM.DD"
                />
                <button
                    type="button"
                    onClick={openCalendar}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3"
                >
                <img src={Calendar} alt="달력" className="w-6 h-6 pointer-events-none" />
                </button>
    

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