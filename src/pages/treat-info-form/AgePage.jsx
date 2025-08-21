/* 사전 문진 정보 입력 페이지 (생년월일) */

//import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTreatInfo } from "@contexts/TreatInfoContext";
import TextButton from "../../components/commons/TextButton";
import TextField from "../../components/forms/TextField";
import TitleBlock from "../../components/commons/TitleBlock";
import WhiteChevronRight from "@assets/images/white_chevron_right.svg";
import Calendar from "@assets/images/calendar.svg";


const AgePage = () => {
    // const { t } = useTranslation();
    const [birthDate, setBirthDate] = useState('');
    const inputRef = useRef(null);
    const { formData, updateField } = useTreatInfo();
    const navigate = useNavigate(); 

    // Context에서 나이 로드 (생년월일 -> 나이 계산)
    useEffect(() => {
        if (formData.age) {
            const currentYear = new Date().getFullYear();
            const birthYear = currentYear - parseInt(formData.age);
            setBirthDate(`${birthYear}-01-01`);
        }
    }, [formData.age]);


    const calculateAge = (birthDate) => {
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };
    
    const isValidBirthDate = (birthDate) => {
        if (!birthDate) return false;
        const birth = new Date(birthDate);
        const today = new Date();
        return birth <= today; // 오늘 이전 날짜만 유효
    };

    const canMoveNextStep = birthDate !== '' && isValidBirthDate(birthDate);
   
    const handleNext = () => {
        const age = calculateAge(birthDate);
        updateField('age', age.toString());
        console.log('birthDate:', birthDate, 'calculated age:', age);
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
                    className="text-gray-400"
                />
                <button
                    type="button"
                    onClick={openCalendar}
                    className="absolute right-4 top-2.5 p-2"
                >
                <img src={Calendar} alt="달력" className="w-5 h-5 pointer-events-none" />
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