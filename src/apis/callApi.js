import api from "@utils/apiClient";

/**
 * 통화 기록을 가져오는 함수 (향후 API 엔드포인트가 추가될 때를 대비)
 * @returns {Promise<Array>} 통화 기록 배열
 */
export const getCallHistory = async (language = 'ko') => {
    const translations = {
        ko: { 
            appointment: '예약'
        },
        en: { 
            appointment: 'Appointment'
        },
        'zh-CN': { 
            appointment: '预约'
        }
    };

    const t = translations[language] || translations['ko']; // 기본값 설정

    try {
        const approvedReservations = JSON.parse(localStorage.getItem('approvedReservations') || '[]');

        const callHistoryFromReservations = approvedReservations.map((reservation) => ({
            id: `call_${reservation.id}`,
            title: `${reservation.hospital} - ${t.appointment}`,
            createdAt: reservation.createdAt
        }));
        return callHistoryFromReservations;
    } catch (error) {
        console.error('통화 기록을 가져오는 중 오류 발생:', error);
        throw error;
    }
};