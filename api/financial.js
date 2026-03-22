module.exports = async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { corpCode, bsnsYear, reprtCode } = req.body;

  // 입력값 검증
  if (!corpCode || !bsnsYear || !reprtCode) {
    return res.status(400).json({ 
      error: '필수 파라미터 누락: corpCode, bsnsYear, reprtCode' 
    });
  }

  const apiKey = process.env.OPENDART_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API 키가 설정되지 않았습니다' });
  }

  try {
    const url = `https://opendart.fss.or.kr/api/fnlttSinglAcnt.json?crtfc_key=${apiKey}&corp_code=${corpCode}&bsns_year=${bsnsYear}&reprt_code=${reprtCode}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`OpenDART API Error: ${response.statusText}`);
    }

    const data = await response.json();

    // OpenDART 에러 확인
    if (data.status !== '000') {
      console.error('OpenDART Error:', data);
      return res.status(400).json({ 
        status: data.status,
        message: data.message || '데이터 조회 실패',
        list: []
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Financial API Error:', error);
    res.status(500).json({ 
      error: error.message,
      list: []
    });
  }
};
