import api from "@utils/apiClient"; 

/**
 * 통화 기록을 가져오는 함수 (향후 API 엔드포인트가 추가될 때를 대비)
 * @returns {Promise<Array>} 통화 기록 배열
 */
export const getCallHistory = async () => {
    try {
        return [
            {
        id: "chat_001",
        title: "AI 자동 생성 제목",
        description: "내과 예약 관련 통역 채팅",
        createdAt: "2025-08-25"
            },
            {
        id: "chat_001",
        title: "제목",
        description: "내과 예약 관련 통역 채팅",
        createdAt: "2025-08-25"
            },

        ];
    } catch (error) {
        console.error('통화 기록을 가져오는 중 오류 발생:', error);
        throw error;
    }
};