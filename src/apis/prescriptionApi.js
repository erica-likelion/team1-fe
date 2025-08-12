/**
 * API service for prescription-related operations
 */

const API_BASE_URL = 'http://localhost:3000'; // TODO: Replace with actual backend URL

/**
 * Upload prescription image and get AI analysis
 * @param {File} imageFile - The prescription image file
 * @param {string} language - User language ("english", "chinese", or "korean")
 * @returns {Promise<Object>} API response with analysis
 */
export const uploadPrescription = async (imageFile, language) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('language', language === 'ko' ? 'korean' : language === 'zh-CN' ? 'chinese' : 'english');

    const response = await fetch(`${API_BASE_URL}/api/prescription`, {
      method: 'POST',
      body: formData, // FormData는 Content-Type 헤더를 자동으로 설정
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading prescription:', error);
    throw error;
  }
};

/**
 * Mock API response for development/testing
 * @param {File} imageFile - The prescription image file
 * @param {string} language - User language
 * @returns {Promise<Object>} Mock API response
 */
export const mockUploadPrescription = async (imageFile, language) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
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

  const lang = language === 'ko' ? 'english' : language === 'zh-CN' ? 'chinese' : 'english';
  return mockResponses[lang];
};