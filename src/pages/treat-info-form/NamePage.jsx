/* 사전 문진 정보 입력 페이지 (이름) */

import { useState, useEffect } from "react";
//import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useTreatInfo } from "@contexts/TreatInfoContext";
import TitleBlock from "../../components/commons/TitleBlock";
import TextField from "../../components/forms/TextField";
import TextButton from "../../components/commons/TextButton";
import WhiteChevronRight from "@assets/images/white_chevron_right.svg";

const NamePage = () => {
    // const { t } = useTranslation();
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const { formData, updateField, isStepValid } = useTreatInfo();

    const navigate = useNavigate();

    // Context에서 이름 로드
    useEffect(() => {
        if (formData.name) {
            const nameParts = formData.name.split(' ');
            if (nameParts.length >= 2) {
                setLastName(nameParts[0]);
                setFirstName(nameParts.slice(1).join(' '));
            } else {
                setFirstName(formData.name);
            }
        }
    }, [formData.name]);

    // 버튼 활성화 여부 결정
    const canMoveNextStep = lastName.trim().length > 0 && firstName.trim().length > 0;
    
    const handleNext = () => {
        const fullName = `${lastName.trim()} ${firstName.trim()}`;
        updateField('name', fullName);
        console.log('전체 이름:', fullName);
        navigate('/treat-info-form/age')
    };

    return (
        <div className="p-5">
            
            <TitleBlock
                title = "당신의 이름은 무엇인가요?"
                subtitle = "이름을 입력해주세요."
            />
            <div className="mt-13 ">
                <TextField
                    value={lastName}
                    onChange={setLastName}
                    placeholder="성"
                    maxLength={20}
                />
                <TextField
                    className = "mt-2"
                    value={firstName}
                    onChange={setFirstName}
                    placeholder="이름"
                    maxLength={100}
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

export default NamePage;