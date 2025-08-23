import axios from 'axios';

// API 기본 URL 설정 - 배포 환경에서는 현재 도메인, 개발 환경에서는 localhost 사용
const API_BASE_URL = window.location.origin;

// Axios 인스턴스 생성 - 공통 설정을 위해 사용
const api = axios.create({
  baseURL: API_BASE_URL || 'http://localhost:8080/', // 기본 URL 설정
  timeout: 60000, // 60초 타임아웃 - 병원 상세 정보 조회 시 시간이 걸릴 수 있어 여유있게 설정
  headers: {
    'Content-Type': 'application/json' // JSON 형태로 데이터 송수신
  }
});

/**
 * 요양기관기호(ykiho)를 사용하여 병원의 상세 정보를 조회하는 함수
 * 주로 진료과목 코드(dgsbjtCd) 정보를 얻기 위해 사용됨
 * 
 * @param {string} ykiho - 요양기관기호 (병원 고유 식별자)
 * @returns {Promise<Array>} dgsbjtCd 배열 - 해당 병원에서 진료 가능한 과목 코드들
 * @throws {Error} API 요청 실패 시 에러 throw
 */
export const getHospitalDetail = async (ykiho) => {
  try {
    // GET /api/hospital-detail 엔드포인트 호출 - 병원 상세 정보 조회 API
    const response = await api.get('api/hospital-detail', {
      params: { ykiho } // 요양기관기호를 파라미터로 전달
    });
    
    // 응답에서 진료과목 코드 배열 추출, 없으면 빈 배열 반환
    return response.data.dgsbjtCds || [];
  } catch (error) {
    console.error('Error fetching hospital detail:', error);
    throw error; // 에러를 상위로 전파
  }
};

/**
 * 위치 기반 병원 검색과 상세 정보 조회를 통합한 메인 함수
 * 1단계: 위치 기반으로 병원 목록을 조회
 * 2단계: 각 병원의 상세 정보(진료과목)를 병렬로 조회하여 합침
 * 
 * 성능 최적화를 위해 Promise.allSettled를 사용하여 병렬 처리
 * 일부 병원의 상세 정보 조회가 실패해도 전체 결과에 영향을 주지 않음
 * 
 * @param {number} xPos - 경도 (검색 중심점)
 * @param {number} yPos - 위도 (검색 중심점)  
 * @param {number} radius - 검색 반경 (미터 단위)
 * @returns {Promise<Array>} 병원 기본 정보 + dgsbjtCd(진료과목)가 포함된 완전한 병원 정보 배열
 * @throws {Error} 병원 목록 조회 실패 시 에러 throw
 */
export const getHospitalsWithDetails = async (xPos, yPos, radius) => {
  try {
    // 1단계: 위치 기반 병원 목록 조회
    //console.log(`병원 검색 시작: 위치(${yPos}, ${xPos}), 반경 ${radius}m`);
    const hospitalsResponse = await api.get('api/hospital', {
      params: { xPos, yPos, radius }
    });
    
    const hospitals = hospitalsResponse.data.hospitals || [];
    //console.log(`검색된 병원 수: ${hospitals.length}개`);
    
    // 병원이 없으면 빈 배열 반환
    if (hospitals.length === 0) {
      return [];
    }
    
    // 2단계: 각 병원의 상세 정보(진료과목)를 병렬로 조회
    const hospitalDetailsPromises = hospitals.map(async (hospital, index) => {
      // ykiho가 없는 병원은 빈 진료과목 배열과 함께 반환
      if (!hospital.ykiho) {
        console.warn(`병원 ${hospital.yadmNm}: ykiho 없음`);
        return { ...hospital, dgsbjtCd: [] };
      }
      
      try {
        // 개별 병원의 진료과목 정보 조회
        const dgsbjtCds = await getHospitalDetail(hospital.ykiho);
        //console.log(`병원 ${hospital.yadmNm}: 진료과목 ${dgsbjtCds.length}개 조회 완료`);
        return { ...hospital, dgsbjtCd: dgsbjtCds };
      } catch (error) {
        // 개별 병원 정보 조회 실패 시 경고 로그 출력, 빈 배열로 처리
        console.warn(`병원 ${hospital.yadmNm}(${hospital.ykiho}) 상세정보 조회 실패:`, error.message);
        return { ...hospital, dgsbjtCd: [] };
      }
    });
    
    // Promise.allSettled로 모든 요청을 병렬 처리
    // 일부 실패해도 전체 결과에 영향을 주지 않음
    const hospitalsWithDetails = await Promise.allSettled(hospitalDetailsPromises);
    
    // 성공한 결과만 필터링하여 반환
    const successfulResults = hospitalsWithDetails
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);
    
    //console.log(`최종 반환 병원 수: ${successfulResults.length}개`);
    return successfulResults;
      
  } catch (error) {
    console.error('병원 정보 조회 중 오류 발생:', error);
    throw error; // 메인 에러는 상위로 전파
  }
};