/* 병원 전화 예약 페이지 (전화번호 입력) */

//import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTreatInfo } from "@contexts/TreatInfoContext";
import TextButton from "../../components/commons/TextButton";
import TextField from "../../components/forms/TextField";
import TitleBlock from "../../components/commons/TitleBlock";
import WhiteChevronRight from "@assets/images/white_chevron_right.svg";
import Calendar from "@assets/images/calendar.svg";


const CallNumberPage = () => {
    // const { t } = useTranslation();
    const [Phone, setPhone] = useState('');

    const canMoveNextStep = Phone !== '';


    const handleNext = () => {
        navigate('/call-reservation/time')
    };


    return (
        <div className="p-5">
            <TitleBlock
                title = "어느 병원에 예약할까요?"
                subtitle = "예약하는 병원의 전화번호를 입력해주세요."
            />
            <div className="mt-13 relative ">
                <TextField
                    type="text"
                    value={Phone}
                    onChange={setPhone}
                    placeholder="번호를 입력해주세요."
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

export default CallNumberPage;