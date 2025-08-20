/* 병원 전화 예약 페이지 (전화번호 입력) */

import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router";
import TextButton from "../../components/commons/TextButton";
import TextField from "../../components/forms/TextField";
import TitleBlock from "../../components/commons/TitleBlock";
import WhiteChevronRight from "@assets/images/white_chevron_right.svg";


const CallNumberPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState('');

    // 전화번호 형식 검증
    const isValidPhoneNumber = (phone) => {
        // 한국 전화번호 패턴: 010-1234-5678, 02-123-4567, 031-123-4567 등
        const phoneRegex = /^(01[0-9]|02|0[3-9][0-9])-?[0-9]{3,4}-?[0-9]{4}$/;
        return phoneRegex.test(phone.replace(/-/g, ''));
    };
    
    // 전화번호 자동 하이픈 추가
    const formatPhoneNumber = (value) => {
        const numbers = value.replace(/[^0-9]/g, '');
        
        if (numbers.length <= 3) {
            return numbers;
        } else if (numbers.length <= 7) {
            return numbers.slice(0, 3) + '-' + numbers.slice(3);
        } else if (numbers.length <= 11) {
            return numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7);
        }
        return numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7, 11);
    };
    
    const handlePhoneChange = (value) => {
        // 숫자와 하이픈만 허용
        const formatted = formatPhoneNumber(value);
        setPhoneNumber(formatted);
    };
    
    const canMoveNextStep = phoneNumber.length >= 10 && isValidPhoneNumber(phoneNumber);
    

    const handleNext = () => {
        if (canMoveNextStep) {
            console.log('입력된 전화번호:', phoneNumber);
            navigate('/call-reservation/time');
        }
    };


    return (
        <div className="p-5">
            <TitleBlock
                title = "어느 병원에 예약할까요?"
                subtitle = "예약하는 병원의 전화번호를 입력해주세요."
            />
            <div className="mt-13 relative ">
                <TextField
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="번호를 입력해주세요."
                    maxLength={13}
                    className="w-full px-4 py-4 text-base border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                    prefix="+82"
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