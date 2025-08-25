import api from "@utils/apiClient";

/**
 * 통화 기록을 가져오는 함수 (향후 API 엔드포인트가 추가될 때를 대비)
 * @returns {Promise<Array>} 통화 기록 배열
 */
export const getCallHistory = async (language = 'ko') => {
    const translations = {
        ko: { 
            appointment: '예약', 
            abdominal: '복통 및 소화불량 증상',
            shoulder: '어깨 통증 증상'
        },
        en: { 
            appointment: 'Appointment', 
            abdominal: 'Abdominal pain and indigestion symptoms',
            shoulder: 'Shoulder pain symptoms'
        },
        'zh-CN': { 
            appointment: '预约', 
            abdominal: '腹痛和消化不良症状',
            shoulder: '肩膀疼痛症状'
        }
    };

    const t = translations[language] || translations['ko']; // 기본값 설정

    try {
        return [
            {
                id: "call_001",
                title: `안산고잔바로튼튼의원 - ${t.appointment}`,
                description: t.abdominal,
                createdAt: "2025-08-25"
            },
            {
                id: "call_002", 
                title: `건강한미래항외과의원 - ${t.appointment}`,
                description: t.shoulder,
                createdAt: "2025-08-25"
            },
        ];
    } catch (error) {
        console.error('통화 기록을 가져오는 중 오류 발생:', error);
        throw error;
    }
};