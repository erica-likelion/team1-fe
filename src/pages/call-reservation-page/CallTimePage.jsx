/* 병원 예약 희망 시간 기재 */

//import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import TextButton from "../../components/commons/TextButton";
import TextField from "../../components/forms/TextField";
import TitleBlock from "../../components/commons/TitleBlock";
import WhiteChevronRight from "@assets/images/white_chevron_right.svg";
import Calendar from "@assets/images/calendar.svg";
import Clock from "@assets/images/clock.svg";


const CallTimePage = () => {
    
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [showTimePicker, setShowTimePicker] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate(); 

    const timeSlots = ['9:00','9:30','10:00','10:30','13:30', '14:00', '14:30'];

    // 오늘 날짜 구하기 (YYYY-MM-DD 형식)
    const today = new Date().toISOString().split('T')[0];
    
    // 현재 시간 구하기 (HH:MM 형식)
    const now = new Date();
    const currentTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    // 선택된 날짜가 오늘인지 확인
    const isToday = selectedDate === today;

    // 현재 시간 이후의 시간만 필터링
    const getAvailableTimeSlots = () => {
        if (!isToday) {
            return timeSlots; // 오늘이 아니면 모든 시간 가능
        }
    
        // 오늘인 경우 현재 시간 이후만 가능
        return timeSlots.filter(timeSlot => {
            const [hour, minute] = timeSlot.split(':').map(Number);
            const slotTime = hour * 60 + minute; // 분으로 변환
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            
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


    const handleNext = () => {
        navigate('/treat-info-form/country')
    };

    const canProceed = selectedDate && selectedTime;

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
                title = "언제 진료 받고 싶으세요?"
                subtitle = "예약을 원하는 날짜와 시간을 입력해주세요"
            />
            <div className="mt-13 relative ">
                <TextField
                    ref = {inputRef}
                    type="date"
                    value={selectedDate}
                    onChange={setSelectedDate}
                    placeholder="YYYY.MM.DD"
                    className="text-gray-400"
                    min={today} // 오늘 이전 날짜 선택 불가
                />
                <button
                    type="button"
                    onClick={openCalendar}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3"
                >
                <img src={Calendar} alt="달력" className="w-5 h-5 pointer-events-none" />
                </button>
            </div>
            
            {/* 시간 입력 */}
            <div className="mb-8">
                    <div 
                        className="relative cursor-pointer"
                        onClick={() => setShowTimePicker(true)}
                    >
                        <div className="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-400">
                            {selectedTime || '00:00'}
                        </div>
                        <div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <img src={Clock} alt="시계" className="w-5 h-5 pointer-events-none" />   
                        </div>
                    </div>
                </div>

            {/* 시간 선택 모달 */}
            {showTimePicker && (
                <div className="fixed inset-0 bg-transparent flex items-end z-100">
                    <div className="bg-[#FAFAFA] w-full rounded-2xl p-6 animate-slide-up">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="mt-2 ml-4 text-md font-medium">예약 시간 선택</h3>
                        </div>

                        {/* 날짜를 먼저 선택하라는 메시지 */}
                        {!selectedDate && (
                            <div className="text-center pb-5 text-gray-500">
                                먼저 날짜를 선택해주세요
                            </div>
                        )}
                        
                        {/* 선택 가능한 시간이 없는 경우 */}
                        {selectedDate && availableTimeSlots.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                오늘 예약 가능한 시간이 없습니다.<br/>
                                다른 날짜를 선택해주세요.
                            </div>
                        )}
                        
                        {/* 시간 선택 모달 내용 */}
                        <div className="space-y-3 mb-6 h-60 overflow-y-auto pr-2">
                            {timeSlots.map((time) => (
                                <div
                                    key={time}
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
            )}
        
            
            

            <TextButton
                text="예약하기"
                onClick={handleNext}
                disabled={!canProceed}
                icon={WhiteChevronRight}
            />
            
        
        </div>
    );
};

export default CallTimePage;