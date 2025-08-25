/* 사전 문진 정보 입력 페이지 (생년월일) */

import { useTranslation } from "react-i18next";
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import { useTreatInfo } from "@contexts/TreatInfoContext";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { ko, zhCN, enUS } from 'date-fns/locale';
import TextButton from "../../components/commons/TextButton";
import TitleBlock from "../../components/commons/TitleBlock";
import WhiteChevronRight from "@assets/images/white_chevron_right.svg";
import Calendar from "@assets/images/calendar.svg";


const AgePage = () => {
    const { t, i18n } = useTranslation();
    const [birthDate, setBirthDate] = useState('');
    const { formData, updateField } = useTreatInfo();
    const navigate = useNavigate();

    // 현재 언어에 맞는 로케일 선택
    const getDateLocale = () => {
        switch (i18n.language) {
            case 'ko': return ko;
            case 'zh-CN': return zhCN;
            default: return enUS;
        }
    }; 

    // Context에서 나이 로드 (생년월일 -> 나이 계산)
    useEffect(() => {
        if (formData.age && !birthDate) {
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
    
    const canMoveNextStep = birthDate !== '';
   
    const handleNext = () => {
        //console.log(formData.age);
        navigate('/treat-info-form/country')
    };

    // 생년월일 변경 시 실시간으로 나이 업데이트
    const handleBirthDateChange = (date) => {
        if (date) {
            const dateString = format(date, 'yyyy-MM-dd');
            setBirthDate(dateString);
            const age = calculateAge(dateString);
            updateField('age', age.toString());
        } else {
            setBirthDate('');
        }
    };

    // 캘린더 오픈 시, 키보드 띄움 방지
    // https://stackoverflow.com/questions/68527977/react-datepicker-disable-entering-date-manually
    const handleFocus = (e) => {
    const { target } = e;

        if (target) {
        target.readOnly = true;  // -------> this for all others
        target.blur(); //  ------> this for ios iphone, TV Browsers, Ipad, Safari
        }
    };


    // label과 datepicker 충돌 방지하여, 날짜 선택 후 안닫히는 버그 해결
    // https://github.com/Hacker0x01/react-datepicker/issues/1012
    const labelContentRef = useRef(null)
    const onClickLabel = useCallback(
        event => {
            if (event.nativeEvent.target !== labelContentRef.current) {
                event.preventDefault()
            }
        },
        []
    )

    return (
        <div className="p-5">
            <TitleBlock
                title = {t('precheck.age.title')}
                subtitle = {t('precheck.age.description')}
            />
            <div className="mt-13 mb-14">
                <label htmlFor="customDatepicker" onClick={onClickLabel} className="flex justify-center items-center border border-gray-200 rounded-md px-4">
                <DatePicker
                    id="customDatepicker"
                    dateFormat='yyyy.MM.dd'
                    shouldCloseOnSelect
                    minDate={new Date('1900-01-01')}
                    maxDate={new Date()}
                    selected={birthDate ? new Date(birthDate) : null}
                    onChange={handleBirthDateChange}
                    placeholderText="YYYY.MM.DD"
                    className="w-full placeholder:text-[#A6A9AA] outline-none h-14 cursor-pointer"
                    wrapperClassName="w-full"
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                    locale={getDateLocale()}
                    onFocus={handleFocus}
                />
                    <img src={Calendar} ref={labelContentRef} alt="calendarIcon" className="w-5 h-5 cursor-pointer" />
                </label>
            </div>

            <TextButton
                text={t('precheck.buttons.submit')}
                progress="2/5"
                onClick={handleNext}
                disabled={!canMoveNextStep}
                icon={WhiteChevronRight}
            />
            
        </div>
    );
};

export default AgePage;