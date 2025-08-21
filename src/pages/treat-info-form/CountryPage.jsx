/* 사전 문진 정보 입력 페이지 (국적) */

import { useTranslation } from "react-i18next";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { useTreatInfo } from "@contexts/TreatInfoContext";
import countries from "i18n-iso-countries";
import koLocale from "i18n-iso-countries/langs/ko.json";
import enLocale from "i18n-iso-countries/langs/en.json";
import zhLocale from "i18n-iso-countries/langs/zh.json";
import TextButton from "../../components/commons/TextButton";
import DropdownRadio from "../../components/forms/DropdownRadio";
import TitleBlock from "../../components/commons/TitleBlock";
import WhiteChevronRight from "@assets/images/white_chevron_right.svg";

// 언어 데이터 등록
countries.registerLocale(koLocale);
countries.registerLocale(enLocale);
countries.registerLocale(zhLocale);

const CountryPage = () => {
    
    const { t, i18n } = useTranslation();
    const [countryCode, setCountryCode] = useState('');
    const { formData, updateField, isStepValid } = useTreatInfo();

    const navigate = useNavigate();

    // i18n-iso-countries를 사용해서 모든 국가 목록 생성
    const countryList = useMemo(() => {
        const currentLang = i18n.language === 'ko' ? 'ko' : 
                           i18n.language === 'zh-CN' ? 'zh' : 'en';
        
        // 모든 국가 코드 가져오기
        const allCountries = countries.getNames(currentLang);
        
        return Object.keys(allCountries).map(code => ({
            key: code,
            text: allCountries[code]
        })).sort((a, b) => a.text.localeCompare(b.text));
    }, [i18n.language]);

    // Context에서 국적 로드 (영어 국가명 -> 국가 코드로 역변환)
    useEffect(() => {
        if (formData.nationality) {
            // 영어 국가명에서 국가 코드 찾기
            const foundCountry = Object.keys(countries.getNames('en')).find(code => 
                countries.getName(code, 'en') === formData.nationality
            );
            if (foundCountry) {
                setCountryCode(foundCountry);
            }
        }
    }, [formData.nationality]);

    const canMoveNextStep = countryCode !== '';

    const handleNext = () => {
        navigate('/treat-info-form/gender');
    };

    // 실시간으로 국적 업데이트
    const handleCountryChange = (selectedCode) => {
        console.log('handleCountryChange 호출됨:', selectedCode);
        setCountryCode(selectedCode);
        const englishName = countries.getName(selectedCode, 'en');
        updateField('nationality', englishName);
    };

    return (
        <div className="p-5">
            <TitleBlock
                title = "당신은 어느 나라 사람인가요?"
                subtitle = "태어난 국가를 입력해주세요."
            />
        
            <TextButton
                        text="입력하기"
                        onClick={handleNext}
                        disabled={!canMoveNextStep}
                        icon={WhiteChevronRight}
            /> 

            <div className="mt-13">
                <DropdownRadio
                    value={countryCode}
                    onChange={handleCountryChange}
                    items={countryList}               
                    placeholder = '국가 선택'
                    className = 'h-14'
                    searchable = {true}
                    searchPlaceholder = '검색' />      
            </div>
               
        </div>
    );
};

export default CountryPage;