/* 병원 전화 예약 페이지 (병원 선택) */

import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useSupportedHospitals } from "@hooks/useSupportedHospitals";
import TextButton from "@components/commons/TextButton";
import TitleBlock from "@components/commons/TitleBlock";
import DropdownRadio from "@components/forms/DropdownRadio";
import WhiteChevronRight from "@assets/images/white_chevron_right.svg";


const CallNumberPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [selectedHospital, setSelectedHospital] = useState('');
    const hospitals = useSupportedHospitals();

    // 병원 목록을 드롭다운용으로 변환
    const hospitalItems = hospitals.map((hospital, index) => ({
        key: index.toString(),
        text: hospital.title
    }));

    const canMoveNextStep = selectedHospital !== '';
    
    const handleHospitalChange = (value) => {
        setSelectedHospital(value);
        console.log('선택된 병원:', hospitals[parseInt(value)]);
    };

    const handleNext = () => {
        if (canMoveNextStep) {
            const hospital = hospitals[parseInt(selectedHospital)];
            console.log('선택된 병원:', hospital);
            navigate('/call-reservation/time');
        }
    };

    return (
        <div className="p-5">
            <TitleBlock
                title = {t('call.select.title')}
                subtitle = {t('call.select.description')}
            />
            
            <div className="mt-13">
                <DropdownRadio
                    value={selectedHospital}
                    onChange={handleHospitalChange}
                    items={hospitalItems}               
                    placeholder = {t('call.select.placeholder')}
                    className = 'h-14'
                    searchable = {true}
                    searchPlaceholder = {t('call.select.searchPlaceholder')}
                />      
            </div>

            <TextButton
                text={t('call.buttons.submit')}
                onClick={handleNext}
                disabled={!canMoveNextStep}
                icon={WhiteChevronRight}
            />
            
        
        </div>
    );
};

export default CallNumberPage;