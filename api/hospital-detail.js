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

export default async function handler(req, res) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

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
    const { ykiho } = req.query;
    const serviceKey = process.env.MEDICAL_SERVICE_SECRET;

    if (!ykiho) {
      return res.status(400).json({ error: 'ykiho is required' });
    }

    const dgsbjtCds = await getHospitalDetail(ykiho, serviceKey);
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ dgsbjtCds });
    
  } catch (error) {
    console.error('Hospital Detail API Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
}