import axios from 'axios';

const API_BASE_URL = window.location.origin;

const api = axios.create({
  baseURL: API_BASE_URL || 'http://localhost:8080/',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * 위치 기반으로 병원 정보를 가져오는 함수
 * @param {number} xPos - 경도
 * @param {number} yPos - 위도
 * @param {number} radius - 검색 반경 (미터)
 * @returns {Promise<Array>} 병원 정보 배열
 */
export const getHospitalsByLocation = async (xPos, yPos, radius) => {
  try {
    const response = await api.get('api/hospital', {
      params: {
        xPos,
        yPos,
        radius
      }
    });
    
    return response.data.hospitals || [];
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    throw error;
  }
};

/**
 * ykiho로 병원 상세 정보(dgsbjtCd) 가져오기
 * @param {string} ykiho - 병원 요양기관기호
 * @returns {Promise<Array>} dgsbjtCd 배열
 */
export const getHospitalDetail = async (ykiho) => {
  try {
    const response = await api.get('api/hospital-detail', {
      params: { ykiho }
    });
    
    return response.data.dgsbjtCds || [];
  } catch (error) {
    console.error('Error fetching hospital detail:', error);
    throw error;
  }
};

/**
 * 위치 기반 병원 정보를 가져오고 각 병원의 상세 정보도 함께 조회하는 통합 함수
 * @param {number} xPos - 경도
 * @param {number} yPos - 위도
 * @param {number} radius - 검색 반경 (미터)
 * @returns {Promise<Array>} 병원 정보와 dgsbjtCd가 포함된 배열
 */
export const getHospitalsWithDetails = async (xPos, yPos, radius) => {
  try {
    // 1단계: 위치 기반 병원 목록 조회
    const hospitalsResponse = await api.get('api/hospital', {
      params: { xPos, yPos, radius }
    });
    
    const hospitals = hospitalsResponse.data.hospitals || [];
    
    if (hospitals.length === 0) {
      return [];
    }
    
    // 2단계: 각 병원의 상세 정보를 병렬로 조회
    const hospitalDetailsPromises = hospitals.map(async (hospital) => {
      if (!hospital.ykiho) {
        return { ...hospital, dgsbjtCd: [] };
      }
      
      try {
        const dgsbjtCds = await getHospitalDetail(hospital.ykiho);
        return { ...hospital, dgsbjtCd: dgsbjtCds };
      } catch (error) {
        console.warn(`Failed to fetch details for hospital ${hospital.ykiho}:`, error);
        return { ...hospital, dgsbjtCd: [] };
      }
    });
    
    // 모든 병원 정보를 병렬로 처리
    const hospitalsWithDetails = await Promise.allSettled(hospitalDetailsPromises);
    
    // 성공한 결과만 반환
    return hospitalsWithDetails
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);
      
  } catch (error) {
    console.error('Error fetching hospitals with details:', error);
    throw error;
  }
};