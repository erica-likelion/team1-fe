/* 처방전 관련 API 서비스 */

import api from "@utils/apiClient"; 

/**
 * 처방전 이미지 업로드 및 AI 분석 요청
 * @param {File} image - 처방전 이미지 파일
 * @param {string} language - 사용자 언어 ("english", "chinese", "korean")
 * @returns {Promise<Object>} 분석 결과를 포함한 API 응답
 */
export const uploadPrescription = async (language, image) => {
  try {
    // FormData 객체 생성 및 데이터 추가
    const formData = new FormData();
    formData.append('language', language === 'ko' ? 'korean' : language === 'zh-CN' ? 'chinese' : 'english');
    formData.append('image', image);

    // POST 요청 전송
    const response = await api.post('/api/prescription', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // 파일 업로드를 위한 헤더
      },
    });
    return response.data;
  } catch (error) {
    console.error('처방전 업로드 오류:', error);
    throw error;
  }
};

/**
 * 개발/테스트용 모의 API 응답
 * @param {File} imageFile - 처방전 이미지 파일
 * @param {string} language - 사용자 언어
 * @returns {Promise<Object>} 모의 API 응답
 */
export const mockUploadPrescription = async (imageFile, language) => {
  // API 지연 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 언어별 모의 응답 데이터
  const mockResponses = {
    english: {
      id: 1,
      content: "**Medication Analysis:**\n\n**Amoxicillin 500mg**\n- **Purpose**: Antibiotic for bacterial infections\n- **Dosage**: Take 1 capsule 3 times daily\n- **Duration**: 7 days\n- **Precautions**: Take with food, complete full course\n- **Side effects**: Nausea, diarrhea, allergic reactions\n\n**Ibuprofen 200mg**\n- **Purpose**: Pain relief and anti-inflammatory\n- **Dosage**: 1-2 tablets every 6-8 hours as needed\n- **Precautions**: Take with food, do not exceed 6 tablets daily\n- **Side effects**: Stomach upset, dizziness",
      koreanContent: "**의약품 분석:**\n\n**아목시실린 500mg**\n- **효능**: 세균 감염 치료용 항생제\n- **복용법**: 1일 3회, 1회 1캡슐\n- **복용기간**: 7일\n- **주의사항**: 음식과 함께 복용, 처방된 기간 완전 복용\n- **부작용**: 메스꺼움, 설사, 알레르기 반응\n\n**이부프로펜 200mg**\n- **효능**: 진통 및 소염제\n- **복용법**: 필요시 6-8시간마다 1-2정\n- **주의사항**: 음식과 함께 복용, 하루 6정 초과 금지\n- **부작용**: 위장 장애, 어지러움",
      image: null
    },
    chinese: {
      id: 1,
      content: "**药物分析:**\n\n**阿莫西林 500毫克**\n- **用途**: 治疗细菌感染的抗生素\n- **剂量**: 每日3次，每次1粒\n- **疗程**: 7天\n- **注意事项**: 与食物一起服用，完成整个疗程\n- **副作用**: 恶心、腹泻、过敏反应\n\n**布洛芬 200毫克**\n- **用途**: 止痛和抗炎\n- **剂量**: 根据需要每6-8小时1-2片\n- **注意事项**: 与食物一起服用，每日不超过6片\n- **副作用**: 胃部不适、头晕",
      koreanContent: "**의약품 분석:**\n\n**아목시실린 500mg**\n- **효능**: 세균 감염 치료용 항생제\n- **복용법**: 1일 3회, 1회 1캡슐\n- **복용기간**: 7일\n- **주의사항**: 음식과 함께 복용, 처방된 기간 완전 복용\n- **부작용**: 메스꺼움, 설사, 알레르기 반응\n\n**이부프로펜 200mg**\n- **효능**: 진통 및 소염제\n- **복용법**: 필요시 6-8시간마다 1-2정\n- **주의사항**: 음식과 함께 복용, 하루 6정 초과 금지\n- **부작용**: 위장 장애, 어지러움",
      image: null
    }
  };

  // 언어 코드를 기반으로 적절한 응답 선택
  const lang = language === 'ko' ? 'english' : language === 'zh-CN' ? 'chinese' : 'english';
  return mockResponses[lang];
};

/**
 * 고유번호로 처방전 정보를 조회하는 함수
 * @param {string|number} prescriptionId - 처방전 고유번호
 * @returns {Promise<Object>} 처방전 상세 정보
 */
export const getPrescriptionById = async (prescriptionId) => {
    try {
        const response = await api.get(`/api/prescription/${prescriptionId}`);
        return response.data;
    } catch (error) {
        console.error(`처방전 ID ${prescriptionId} 조회 중 오류 발생:`, error);
        throw error;
    }
};

/**
 * 고유번호로 사전 문진 정보를 조회하는 함수
 * @param {string|number} precheckId - 사전 문진 고유번호
 * @returns {Promise<Object>} 사전 문진 상세 정보
 */
export const getPrecheckById = async (precheckId) => {
    try {
        const response = await api.get(`/api/precheck/${precheckId}`);
        return response.data;
    } catch (error) {
        console.error(`사전 문진 ID ${precheckId} 조회 중 오류 발생:`, error);
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