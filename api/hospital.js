import { XMLParser } from 'fast-xml-parser';

/**
 * XML 응답 데이터 파싱 함수
 * fast-xml-parser를 사용하여 공공데이터 API XML 응답을 JavaScript 객체로 변환
 * 기본 병원 정보만 파싱하고, 상세 정보(진료과목)는 별도 API에서 조회
 * 
 * @param {string} xmlString - 공공데이터 API에서 받은 XML 응답 문자열
 * @returns {Array} 파싱된 기본 병원 정보 배열
 */
function parseHospitalXML(xmlString) {
  try {
    // fast-xml-parser 옵션 설정
    const options = {
      ignoreAttributes: false,
      parseAttributeValue: false,
      parseTagValue: true,
      trimValues: true,
      ignoreNameSpace: false,
      removeNSPrefix: false,
      parseNodeValue: true,
      parseTrueNumberOnly: false,
      arrayMode: false,
      isArray: (name, jpath, isLeafNode, isAttribute) => {
        // item 태그는 항상 배열로 처리
        if (name === 'item') return true;
        return false;
      }
    };

    const parser = new XMLParser(options);
    const result = parser.parse(xmlString);
    
    // API 응답 구조에 따라 item 배열 추출
    let items = [];
    if (result?.response?.body?.items?.item) {
      items = Array.isArray(result.response.body.items.item) 
        ? result.response.body.items.item 
        : [result.response.body.items.item];
    }

    // 병원 정보 객체 배열로 변환
    const hospitals = items.map(item => ({
      xPos: parseFloat(item.XPos) || null,           // 경도
      yPos: parseFloat(item.YPos) || null,           // 위도
      distance: parseFloat(item.distance) || null,   // 중심점으로부터 거리
      clCd: item.clCd || '',                        // 종별코드 (병원 분류)
      telno: item.telno || '',                      // 전화번호
      yadmNm: item.yadmNm || '',                    // 병원명
      ykiho: item.ykiho || ''                       // 요양기관기호
    }));
    
    //console.log(`XML에서 ${hospitals.length}개 병원 파싱 완료`);
    return hospitals;
  } catch (error) {
    console.error('XML 파싱 중 오류 발생:', error);
    return []; // 실패 시 빈 배열 반환
  }
}

/**
 * Vercel Serverless Function - 병원 목록 조회 API
 * 공공데이터포털의 의료기관 정보를 활용하여 위치 기반 병원 검색 서비스 제공
 * 
 * 주요 기능:
 * 1. 위치(위도/경도) 기반 주변 병원 검색
 * 2. XML 응답을 JSON 형태로 변환하여 기본 병원 정보 제공
 * 3. 상세 정보(진료과목)는 별도 API(/api/hospital-detail)에서 조회
 * 
 * @param {Object} req - HTTP 요청 객체
 * @param {Object} req.query - 쿼리 파라미터 {xPos, yPos, radius}
 * @param {Object} res - HTTP 응답 객체
 */
export default async function handler(req, res) {
  try {
    const { xPos, yPos, radius } = req.query;
    const serviceKey = process.env.MEDICAL_SERVICE_SECRET;

    // API 호출 URL 구성
    const baseUrl = 'https://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList';
    
    const params = new URLSearchParams({
      ServiceKey: serviceKey,
      xPos,
      yPos,
      radius,
      numOfRows: 100 // 응답 개수를 최대 100개 제한
    });

    const apiUrl = `${baseUrl}?${params}`;
    
    // 공공데이터 API 호출
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    const xmlData = await response.text();
    
    // XML 파싱하여 필요한 데이터만 추출 (dgsbjtCd 포함)
    const hospitals = await parseHospitalXML(xmlData);
    
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