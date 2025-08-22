/* 병원 예약 희망 시간 기재 */

import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useUser } from "@contexts/UserContext";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { ko, zhCN, enUS } from 'date-fns/locale';
import TextButton from "@components/commons/TextButton";
import TitleBlock from "@components/commons/TitleBlock";
import WhiteChevronRight from "@assets/images/white_chevron_right.svg";
import Calendar from "@assets/images/calendar.svg";
import Clock from "@assets/images/clock.svg";


const CallTimePage = () => {
    const { t, i18n } = useTranslation();
    const { user } = useUser();
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [showTimePicker, setShowTimePicker] = useState(false);
    const navigate = useNavigate();
    
    // 현재 언어에 맞는 로케일 선택
    const getDateLocale = () => {
        switch (i18n.language) {
            case 'ko': return ko;
            case 'zh-CN': return zhCN;
            default: return enUS;
        }
    }; 

    const timeSlots = ['09:00','09:30','10:00','10:30','13:30', '14:00', '14:30', '15:30',
                        '16:00', '16:30', '17:00', '17:30', '18:00'];

    // 오늘 날짜
    const today = new Date();
    
    // 오늘로부터 2주 후 날짜
    const twoWeeksFromToday = new Date();
    twoWeeksFromToday.setDate(today.getDate() + 14);

    // 선택된 날짜가 오늘인지 확인
    const isToday = selectedDate && format(new Date(selectedDate), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

    // 현재 시간 이후의 시간만 필터링
    const getAvailableTimeSlots = () => {
        if (!isToday) {
            return timeSlots; // 오늘이 아니면 모든 시간 가능
        }
    
        // 오늘인 경우 현재 시간 이후만 가능
        return timeSlots.filter(timeSlot => {
            const [hour, minute] = timeSlot.split(':').map(Number);
            const slotTime = hour * 60 + minute; // 분으로 변환
            const currentMinutes = today.getHours() * 60 + today.getMinutes();
            
            return slotTime > currentMinutes;
        });
    };
    
    const availableTimeSlots = getAvailableTimeSlots();

    // 날짜가 변경될 때 시간 검증
    useEffect(() => {
        if (selectedTime && isToday) {
            const isTimeStillValid = availableTimeSlots.includes(selectedTime);
            if (!isTimeStillValid) {
                setSelectedTime(''); // 현재 시간보다 이전 시간이면 초기화
            }
        }
    }, [selectedDate, selectedTime, isToday, availableTimeSlots]);


    // DatePicker 날짜 변경 핸들러
    const handleDateChange = (date) => {
        if (date) {
            const dateString = format(date, 'yyyy-MM-dd');
            setSelectedDate(dateString);
        } else {
            setSelectedDate('');
        }
    };

    // 캘린더 오픈 시, 키보드 띄움 방지
    const handleFocus = (e) => {
        const { target } = e;
        if (target) {
            target.readOnly = true;
            target.blur();
        }
    };

    // label과 datepicker 충돌 방지
    const labelContentRef = useRef(null);
    const onClickLabel = useCallback(
        event => {
            if (event.nativeEvent.target !== labelContentRef.current) {
                event.preventDefault();
            }
        },
        []
    );

    const handleNext = () => {
        // 선택된 날짜와 시간을 CallLoadingPage로 전달
        navigate('/call-reservation/loading', {
            state: {
                selectedDate: selectedDate,
                selectedTime: selectedTime
            }
        });
    };

    
    const canProceed = selectedDate && selectedTime;

    return (
        <div className="p-5">
            <TitleBlock
                title = {t('call.date.title')}
                subtitle = {t('call.date.description')}
            />
            <div className="mt-13 mb-2">
                <label htmlFor="callDatePicker" onClick={onClickLabel} className="flex justify-center items-center border border-gray-200 rounded-md px-4">
                    <DatePicker
                        id="callDatePicker"
                        dateFormat='yyyy.MM.dd'
                        shouldCloseOnSelect
                        minDate={today}
                        maxDate={twoWeeksFromToday}
                        selected={selectedDate ? new Date(selectedDate) : null}
                        onChange={handleDateChange}
                        placeholderText="YYYY.MM.DD"
                        className="w-full placeholder:text-[#A6A9AA] outline-none h-14 cursor-pointer"
                        wrapperClassName="w-full"
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"
                        locale={getDateLocale()}
                        onFocus={handleFocus}
                    />
                    <img src={Calendar} ref={labelContentRef} alt="Calendar" className="w-5 h-5 cursor-pointer" />
                </label>
            </div>
            
            {/* 시간 입력 */}
            <div className="mb-8">
                    <div 
                        className={`relative ${selectedDate ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                        onClick={() => {
                            if (selectedDate) {
                                setShowTimePicker(!showTimePicker); // 토글 기능
                            }
                        }}
                    >
                        <div className={`w-[335px] p-4 border border-gray-200 rounded-lg bg-gray-50 ${selectedTime ? "text-black" : "text-gray-400"}`}>
                            {selectedTime || '00:00'}
                        </div>
                        <div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <img src={Clock} alt="Clock" className="w-5 h-5 pointer-events-none" />   
                        </div>
                    </div>
                </div>

             {/* 시간 선택 모달 */}
             {showTimePicker && (
                <div className="fixed inset-0 bg-transparent flex items-end z-100"
                     onClick={() => setShowTimePicker(false)} // 배경 클릭 시 모달 닫기
                >
                    <div className="w-full max-w-[375px] mx-auto shadow-[0_-2px_4px_0_rgba(0,0,0,0.10)] rounded-t-sm"
                         onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 이벤트 버블링 방지
                    >
                        <div className="bg-[#FAFAFA] w-full pt-11.5 px-12 pb-11 animate-slide-up">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-semibold text-[#64686A]">{t('call.date.timeGuide')}</h3>
                            </div>

                            
                            {/* 선택 가능한 시간이 없는 경우 -> 추후 설정 필요 */}
                            {selectedDate && availableTimeSlots.length === 0 && (
                                <div className="text-center pb-5 text-gray-500 whitespace-pre-line">
                                    {t('call.date.noTime')}
                                </div>
                            )}
                            
                            {/* 시간 선택 모달 내용 */}
                            <div className="space-y-3 h-60 overflow-y-auto pr-2 no-scrollbar">
                                {availableTimeSlots.map((time) => (
                                    <div
                                        key={time}
                                        disabled = {!selectedDate}
                                        onClick={() => {
                                            setSelectedTime(time);
                                            setShowTimePicker(false);
                                        }}
                                        
                                        className={`flex items-center justify-between pl-4 pb-3 cursor-pointer transition-colors ${
                                            selectedTime === time
                                                ? 'text-[#3DE0AB] border-transparent'
                                                : 'bg-transparent border-transparent text-gray-400 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="font-medium">{time}</span>
                                        {selectedTime === time && (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        )}
                                    </div>
                                ))}
                            </div>
                        
                        </div>
                    </div>
                </div>
            )}
        
            
            

            <TextButton
                text={t('call.buttons.reservation')}
                onClick={handleNext}
                disabled={!canProceed}
                icon={WhiteChevronRight}
            />
            
        
        </div>
    );
};

export default CallTimePage;