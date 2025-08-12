/* 사전 문진 정보 입력 페이지 (국적) */

import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router";
import TextButton from "../../components/commons/TextButton";
import DropdownRadio from "../../components/forms/DropdownRadio";
import TitleBlock from "../../components/commons/TitleBlock";
import WhiteChevronRight from "@assets/images/white_chevron_right.svg";

const CountryPage = () => {
    
    const { t } = useTranslation();
    const [country, setCountry] = useState('')

    const navigate = useNavigate(); 

    const countries = [
        { key: 'kr', text: '대한민국' },
        { key: 'us', text: '미국' },
        { key: 'jp', text: '일본' },
        { key: 'cn', text: '중국' },
        { key: 'gb', text: '영국' },
        { key: 'fr', text: '프랑스' },
        { key: 'de', text: '독일' },
        { key: 'ca', text: '캐나다' },
        { key: 'au', text: '호주' },
        { key: 'br', text: '브라질' },
        { key: 'in', text: '인도' },
        { key: 'mx', text: '멕시코' },
        { key: 'es', text: '스페인' },
        { key: 'it', text: '이탈리아' },
        { key: 'ru', text: '러시아' },
        { key: 'vn', text: '베트남' },
        { key: 'th', text: '태국' },
        { key: 'sg', text: '싱가포르' }
    ];

    const handleNext = () => {
        console.log('country:', country);
        navigate('/treat-info-form/gender')
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
                        // disabled={!canMoveNextStep}
                        icon={WhiteChevronRight}
            /> 

            <div className="mt-13">
                <DropdownRadio
                    value={country}
                    onChange={setCountry}
                    items={countries}               
                    placeholder = '국가 선택'
                    className = ''
                    searchable = {true}
                    searchPlaceholder = '검색' />      
            </div>
               
        </div>
    );
};

export default CountryPage;