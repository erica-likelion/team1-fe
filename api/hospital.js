/**
 * 병원 상세 정보 API - 진료과목 코드(dgsbjtCd) 조회
 * 공공데이터포털의 의료기관 상세정보 API를 사용하여 특정 병원의 진료과목 정보를 가져옴
 * 
 * @param {string} ykiho - 요양기관기호 (병원 고유 식별자)
 * @param {string} serviceKey - 공공데이터 API 서비스 키
 * @returns {Promise<Array>} dgsbjtCd 배열 - 해당 병원에서 진료 가능한 과목 코드 목록
 */
async function getHospitalDetail(ykiho, serviceKey) {
  try {
    // 공공데이터포털 의료기관 상세정보 서비스 API URL
    const baseUrl = 'https://apis.data.go.kr/B551182/MadmDtlInfoService2.7/getDgsbjtInfo2.7';
    
    // API 요청 파라미터 구성
    const params = new URLSearchParams({
      ServiceKey: serviceKey, // 공공데이터 API 인증키
      ykiho: ykiho,          // 요양기관기호 
      _type: 'json'          // 응답 형식 (JSON)
    });

    const apiUrl = `${baseUrl}?${params}`;
    
    // 공공데이터 API 호출
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    const data = await response.json();
    
    // API 응답에서 진료과목 코드(dgsbjtCd) 추출
    const dgsbjtCds = [];
    if (data.response && data.response.body && data.response.body.items) {
      const items = data.response.body.items.item;
      
      // items가 배열인 경우 (여러 진료과목)
      if (Array.isArray(items)) {
        items.forEach(item => {
          if (item.dgsbjtCd) {
            dgsbjtCds.push(item.dgsbjtCd);
          }
        });
      } 
      // items가 단일 객체인 경우 (진료과목 1개)
      else if (items && items.dgsbjtCd) {
        dgsbjtCds.push(items.dgsbjtCd);
      }
    }
    
    return dgsbjtCds;
  } catch (error) {
    console.error(`요양기관기호 ${ykiho}의 상세정보 조회 실패:`, error);
    return []; // 실패 시 빈 배열 반환
  }
}

/**
 * XML 응답 데이터 파싱 함수
 * 공공데이터 API에서 받은 XML 형식의 병원 목록을 JavaScript 객체로 변환
 * 각 병원의 진료과목 정보도 함께 조회하여 완전한 데이터 구성
 * 
 * @param {string} xmlString - 공공데이터 API에서 받은 XML 응답 문자열
 * @param {string} serviceKey - 공공데이터 API 서비스 키 (진료과목 조회용)
 * @returns {Promise<Array>} 파싱된 병원 정보 배열 (진료과목 포함)
 */
async function parseHospitalXML(xmlString, serviceKey) {
  try {
    // 서버 환경에서 정규식을 사용한 XML 파싱 (DOMParser 사용 불가)
    const hospitals = [];
    
    // XML에서 <item> 태그들을 찾아서 각 병원 정보 추출
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    
    while ((match = itemRegex.exec(xmlString)) !== null) {
      const itemContent = match[1]; // <item> 태그 내부 내용
      
      // 각 병원의 필드 데이터 추출
      const xPos = extractValue(itemContent, 'XPos');     // 경도
      const yPos = extractValue(itemContent, 'YPos');     // 위도  
      const distance = extractValue(itemContent, 'distance'); // 중심점으로부터 거리
      const clCd = extractValue(itemContent, 'clCd');     // 종별코드 (병원 분류)
      const telno = extractValue(itemContent, 'telno');   // 전화번호
      const yadmNm = extractValue(itemContent, 'yadmNm'); // 병원명
      const ykiho = extractValue(itemContent, 'ykiho');   // 요양기관기호
      
      // 병원 객체 생성 및 배열에 추가
      hospitals.push({
        xPos: parseFloat(xPos) || null,       // 숫자 변환, 실패시 null
        yPos: parseFloat(yPos) || null,       
        distance: parseFloat(distance) || null,
        clCd,      // 문자열 그대로
        telno,     
        yadmNm,    
        ykiho      
      });
    }
    
    console.log(`XML에서 ${hospitals.length}개 병원 파싱 완료`);
    
    // 각 병원의 진료과목 정보를 병렬로 조회하여 완전한 데이터 구성
    const hospitalsWithDetails = await Promise.all(
      hospitals.map(async (hospital) => {
        // 요양기관기호가 있는 경우에만 상세정보 조회
        if (hospital.ykiho) {
          const dgsbjtCds = await getHospitalDetail(hospital.ykiho, serviceKey);
          return { ...hospital, dgsbjtCd: dgsbjtCds };
        }
        // 요양기관기호가 없으면 빈 진료과목 배열
        return { ...hospital, dgsbjtCd: [] };
      })
    );
    
    console.log(`${hospitalsWithDetails.length}개 병원의 상세정보 조회 완료`);
    return hospitalsWithDetails;
  } catch (error) {
    console.error('XML 파싱 중 오류 발생:', error);
    return []; // 실패 시 빈 배열 반환
  }
}

/**
 * XML 내용에서 특정 태그의 값을 추출하는 유틸리티 함수
 * 정규식을 사용하여 XML 태그의 내용을 파싱
 * 
 * @param {string} xmlContent - XML 내용 문자열
 * @param {string} tagName - 추출할 태그명
 * @returns {string} 태그 내용 (없으면 빈 문자열)
 */
function extractValue(xmlContent, tagName) {
  const regex = new RegExp(`<${tagName}>(.*?)<\/${tagName}>`, 's'); // 's' 플래그로 개행문자도 매치
  const match = xmlContent.match(regex);
  return match ? match[1].trim() : ''; // 태그 내용의 앞뒤 공백 제거
}

/**
 * Vercel Serverless Function - 병원 목록 조회 API
 * 공공데이터포털의 의료기관 정보를 활용하여 위치 기반 병원 검색 서비스 제공
 * 
 * 주요 기능:
 * 1. 위치(위도/경도) 기반 주변 병원 검색
 * 2. 각 병원의 진료과목 정보 추가 조회
 * 3. XML 응답을 JSON 형태로 변환하여 프론트엔드에 제공
 * 
 * @param {Object} req - HTTP 요청 객체
 * @param {Object} req.query - 쿼리 파라미터 {xPos, yPos, radius}
 * @param {Object} res - HTTP 응답 객체
 */
export default async function handler(req, res) {
  // OPTIONS 요청 처리
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET 요청만 허용
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { xPos, yPos, radius } = req.query;
    const serviceKey = process.env.MEDICAL_SERVICE_SECRET;

    // API 호출 URL 구성
    const baseUrl = 'https://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList';
    
    const params = new URLSearchParams({
      ServiceKey: serviceKey,
      xPos,
      yPos,
      radius
    });

    const apiUrl = `${baseUrl}?${params}`;
    
    // 공공데이터 API 호출
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    const xmlData = await response.text();
    
    // XML 파싱하여 필요한 데이터만 추출 (dgsbjtCd 포함)
    const hospitals = await parseHospitalXML(xmlData, serviceKey);
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ hospitals });
    
  } catch (error) {
    console.error('Hospital API Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
}