import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useUser } from "@contexts/UserContext";
import TextButton from "@components/commons/TextButton";
import WhiteChevronRight from "@assets/images/white_chevron_right.svg";


const CallResultApprovePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t, } = useTranslation();
    const { user } = useUser();

    const { hospital, selectedDate, selectedTime } = location.state || {};

    // 승인된 예약 정보를 로컬 스토리지에 저장
    useEffect(() => {
        if (hospital && selectedDate && selectedTime && user) {
            const reservationData = {
                id: Date.now(), 
                hospital,
                selectedDate,
                selectedTime,
                status: 'approved',
                createdAt: new Date().toLocaleDateString('sv-SE') // YYYY-MM-DD 형식의 한국 시간
            };

            // 기존 예약 목록 가져오기
            const existingReservations = JSON.parse(localStorage.getItem('approvedReservations') || '[]');
            
            // 새로운 예약 추가
            const updatedReservations = [...existingReservations, reservationData];
            
            // 로컬 스토리지에 저장
            localStorage.setItem('approvedReservations', JSON.stringify(updatedReservations));
        }
    }, [hospital, selectedDate, selectedTime, user]);

    const handleNext = () => {
        navigate('/home');
    };

    const getDayofWeek = (dateStr) => {
        //console.log(typeof dateStr);
        const [year, month, day] = dateStr.split('-');
        const date = new Date(year, month-1, day);
        
        return date.getDay();
    }

    return (
        <div className="mt-9.5 px-5">
            {user &&
            <div className="text-center text-[20px] font-semibold whitespace-pre-line">
                {t('call.result.messageParts.part1')}
                {user ? user.name : t('user.defaultName')}
                {t('call.result.messageParts.part2')}
                <span className="text-[#3DE0AB] pl-1">
                    {t('call.result.approve')}
                </span>
                {t('call.result.messageParts.part3')}
            </div>}
            <div className="flex flex-col gap-10 mt-19.5 font-semibold">
                <div className="space-y-3 text-[20px] text-[#BDBDBD]">
                    <p>
                        {t('call.result.hospital')}
                    </p>
                    <p className="font-medium text-2xl text-[#1A1A1A]">
                        {hospital}
                    </p>
                </div>
                <div className="space-y-3 text-[20px] text-[#BDBDBD]">
                    <p>
                        {t('call.result.date')}
                    </p>
                    <p className="font-medium text-2xl text-[#1A1A1A]">
                        {selectedDate}{` (${t(`call.result.day.${getDayofWeek(selectedDate)}`)})`}
                    </p>
                </div>
                <div className="space-y-3 text-[20px] text-[#BDBDBD]">
                    <p>
                        {t('call.result.time')}
                    </p>
                    <p className="font-medium text-2xl text-[#1A1A1A]">
                        {selectedTime}
                    </p>
                </div>
            </div>

            <TextButton
                text={t('call.buttons.home')}
                onClick={handleNext}
                icon={WhiteChevronRight}
            />
        </div>
    );
};

export default CallResultApprovePage;