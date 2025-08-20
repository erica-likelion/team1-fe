/* 사전 문진 정보 입력 페이지 (성별) */

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTreatInfo } from "@contexts/TreatInfoContext";
import TextButton from "../../components/commons/TextButton";
import DropdownRadio from "../../components/forms/DropdownRadio";
import TitleBlock from "../../components/commons/TitleBlock";
import WhiteChevronRight from "@assets/images/white_chevron_right.svg";


const GenderPage = () => {
    const { t } = useTranslation();
    const [gender, setGender] = useState('');
    const { formData, updateField } = useTreatInfo();

    const navigate = useNavigate();

    // Context에서 성별 로드
    useEffect(() => {
        if (formData.gender) {
            setGender(formData.gender === 'M' ? 'm' : 'w');
        }
    }, [formData.gender]); 

    const gender_list = [
        { key: 'm', text: '남성' },
        { key: 'w', text: '여성' }]
    
    const canMoveNextStep = gender !== '';

    const handleNext = () => {
        const genderForAPI = gender === 'm' ? 'M' : 'F';
        updateField('gender', genderForAPI);
        console.log('gender:', gender, 'for API:', genderForAPI);
        navigate('/treat-info-form/symptoms')
    };
    return (
        <div className="p-5">
            <TitleBlock
                title = "당신의 성별은 무엇인가요?"
                subtitle = "성별을 입력해 주세요."
            />
            <div className="mt-13">
                <DropdownRadio
                    value={gender}
                    onChange={setGender}
                    items={gender_list}               
                    placeholder = '성별 선택'
                    className = ''
                    searchable = {false}
                    maxHeight="h-40"
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

export default GenderPage;