// 병원 상세 정보 API (dgsbjtCd 가져오기)
async function getHospitalDetail(ykiho, serviceKey) {
  try {
    const baseUrl = 'https://apis.data.go.kr/B551182/MadmDtlInfoService2.7/getDgsbjtInfo2.7';
    
    const params = new URLSearchParams({
      ServiceKey: serviceKey,
      ykiho: ykiho,
      _type: 'json'
    });

    const apiUrl = `${baseUrl}?${params}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    const data = await response.json();
    
    // items.item에서 dgsbjtCd 추출
    const dgsbjtCds = [];
    if (data.response && data.response.body && data.response.body.items) {
      const items = data.response.body.items.item;
      if (Array.isArray(items)) {
        items.forEach(item => {
          if (item.dgsbjtCd) {
            dgsbjtCds.push(item.dgsbjtCd);
          }
        });
      } else if (items && items.dgsbjtCd) {
        dgsbjtCds.push(items.dgsbjtCd);
      }
    }
    
    return dgsbjtCds;
  } catch (error) {
    console.error(`Error fetching hospital detail for ykiho ${ykiho}:`, error);
    return [];
  }
}

// XML 파싱 함수
async function parseHospitalXML(xmlString, serviceKey) {
  try {
    // 간단한 XML 파싱 (브라우저 환경이 아니므로 DOMParser 대신 정규식 사용)
    const hospitals = [];
    
    // <item> 태그들을 찾아서 파싱
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    
    while ((match = itemRegex.exec(xmlString)) !== null) {
      const itemContent = match[1];
      
      // 각 필드 추출
      const xPos = extractValue(itemContent, 'XPos');
      const yPos = extractValue(itemContent, 'YPos');
      const distance = extractValue(itemContent, 'distance');
      const clCd = extractValue(itemContent, 'clCd');
      const telno = extractValue(itemContent, 'telno');
      const yadmNm = extractValue(itemContent, 'yadmNm');
      const ykiho = extractValue(itemContent, 'ykiho');
      
      hospitals.push({
        xPos: parseFloat(xPos) || null,
        yPos: parseFloat(yPos) || null,
        distance: parseFloat(distance) || null,
        clCd,
        telno,
        yadmNm,
        ykiho
      });
    }
    
    // 각 병원의 dgsbjtCd 정보를 병렬로 가져오기
    const hospitalsWithDetails = await Promise.all(
      hospitals.map(async (hospital) => {
        if (hospital.ykiho) {
          const dgsbjtCds = await getHospitalDetail(hospital.ykiho, serviceKey);
          return { ...hospital, dgsbjtCd: dgsbjtCds };
        }
        return { ...hospital, dgsbjtCd: [] };
      })
    );
    
    return hospitalsWithDetails;
  } catch (error) {
    console.error('XML parsing error:', error);
    return [];
  }
}

// XML에서 특정 태그의 값을 추출하는 함수
function extractValue(xmlContent, tagName) {
  const regex = new RegExp(`<${tagName}>(.*?)<\/${tagName}>`, 's');
  const match = xmlContent.match(regex);
  return match ? match[1].trim() : '';
}

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