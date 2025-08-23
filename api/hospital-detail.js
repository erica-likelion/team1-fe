/**
 * 특정 병원의 상세 정보 조회 함수
 * 공공데이터포털의 의료기관 상세정보 서비스를 사용하여 진료과목 정보를 가져옴
 * 
 * @param {string} ykiho - 요양기관기호 (병원 고유 식별자)
 * @param {string} serviceKey - 공공데이터포털 API 서비스 키
 * @returns {Promise<Array>} 진료과목 코드(dgsbjtCd) 배열
 */
async function getHospitalDetail(ykiho, serviceKey) {
  try {
    // 공공데이터포털 의료기관 상세정보 서비스 API 엔드포인트
    const baseUrl = 'https://apis.data.go.kr/B551182/MadmDtlInfoService2.7/getDgsbjtInfo2.7';
    
    // API 요청 파라미터 구성
    const params = new URLSearchParams({
      ServiceKey: serviceKey, // 공공데이터 API 인증키
      ykiho: ykiho,          // 조회할 병원의 요양기관기호
      _type: 'json'          // 응답 형식 (JSON)
    });

    const apiUrl = `${baseUrl}?${params}`;
    
    // 공공데이터 API 호출
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`공공데이터 API 호출 실패: HTTP ${response.status}`);
    }

    const data = await response.json();
    
    // API 응답에서 진료과목 코드 추출 및 배열 생성
    const dgsbjtCds = [];
    if (data.response && data.response.body && data.response.body.items) {
      const items = data.response.body.items.item;
      
      // 여러 진료과목이 있는 경우 (배열)
      if (Array.isArray(items)) {
        items.forEach(item => {
          if (item.dgsbjtCd) {
            dgsbjtCds.push(item.dgsbjtCd);
          }
        });
      } 
      // 진료과목이 1개인 경우 (단일 객체)
      else if (items && items.dgsbjtCd) {
        dgsbjtCds.push(items.dgsbjtCd);
      }
    }
    
    return dgsbjtCds;
  } catch (error) {
    console.error(`요양기관기호 ${ykiho}의 상세 정보 조회 실패:`, error);
    return []; // 오류 발생 시 빈 배열 반환
  }
}

/**
 * Vercel Serverless Function - 병원 상세 정보 조회 API
 * 특정 병원의 진료과목 정보를 조회하여 반환
 * 
 * 사용 용도:
 * - 병원 목록에서 각 병원의 진료과목 정보를 개별 조회
 * - 프론트엔드에서 병원 선택 시 상세 정보 표시
 * 
 * @param {Object} req - HTTP 요청 객체 (query: {ykiho})
 * @param {Object} res - HTTP 응답 객체
 */
export default async function handler(req, res) {
  // CORS preflight 요청 처리 (브라우저의 사전 요청)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET 메소드만 허용 (RESTful API 설계)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 쿼리 파라미터에서 요양기관기호 추출
    const { ykiho } = req.query;
    // 환경 변수에서 공공데이터 API 키 가져오기
    const serviceKey = process.env.MEDICAL_SERVICE_SECRET;

    // 필수 파라미터 유효성 검사
    if (!ykiho) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'ykiho 파라미터가 필요합니다' 
      });
    }

    //console.log(`병원 상세정보 조회 시작: ykiho=${ykiho}`);
    
    // 병원의 진료과목 정보 조회
    const dgsbjtCds = await getHospitalDetail(ykiho, serviceKey);
    
    //console.log(`진료과목 ${dgsbjtCds.length}개 조회 완료`);
    
    // 응답 헤더 설정 및 데이터 반환
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ dgsbjtCds });
    
  } catch (error) {
    console.error('병원 상세정보 API 오류:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
}