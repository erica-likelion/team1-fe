import api from "@utils/apiClient"; 

/**
 * 통화 기록을 가져오는 함수 (향후 API 엔드포인트가 추가될 때를 대비)
 * @returns {Promise<Array>} 통화 기록 배열
 */
export const getCallHistory = async () => {
    try {
        // 현재는 임시 데이터 반환 (API 엔드포인트가 생기면 수정)
        return [];
    } catch (error) {
        console.error('통화 기록을 가져오는 중 오류 발생:', error);
        throw error;
    }
};