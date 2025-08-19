import api from "@utils/apiClient"; 

/**
 * 진료 기록(precheck) 목록을 가져오는 함수
 * @returns {Promise<Array>} 진료 기록 배열
 */
export const getPrecheckHistory = async () => {
    try {
        const response = await api.get('/api/precheck');
        return response.data;
    } catch (error) {
        console.error('진료 기록을 가져오는 중 오류 발생:', error);
        throw error;
    }
};

/**
 * 처방 기록(prescription) 목록을 가져오는 함수
 * @returns {Promise<Array>} 처방 기록 배열
 */
export const getPrescriptionHistory = async () => {
    try {
        const response = await api.get('/api/prescription');
        return response.data;
    } catch (error) {
        console.error('처방 기록을 가져오는 중 오류 발생:', error);
        throw error;
    }
};

/**
 * 통화 기록을 가져오는 함수 (향후 API 엔드포인트가 추가될 때를 대비)
 * @returns {Promise<Array>} 통화 기록 배열
 */
export const getCallHistory = async () => {
    try {
        // 현재는 임시 데이터 반환 (API 엔드포인트가 생기면 수정)
        return [
            {
                "id": 1,
                "title": "병원 예약 통화",
                "createdAt": "2025-08-22"
            },
            {
                "id": 2,
                "title": "의료진과 상담",
                "createdAt": "2025-08-21"
            }
        ];
    } catch (error) {
        console.error('통화 기록을 가져오는 중 오류 발생:', error);
        throw error;
    }
};