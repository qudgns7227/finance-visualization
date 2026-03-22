const { GoogleGenerativeAI } = require('@google/generative-ai');

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

  const { corpName, financialData } = req.body;

  if (!corpName || !financialData) {
    return res.status(400).json({ error: '필수 파라미터 누락' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API 키가 설정되지 않았습니다' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // 재무 데이터를 이해하기 쉬운 형식으로 포맷
    const financialSummary = JSON.stringify(financialData, null, 2);

    const prompt = `다음은 ${corpName}의 최근 재무 현황입니다:

${financialSummary}

이 재무 데이터를 초등학생도 쉽게 이해할 수 있는 언어로 분석해주세요.

다음 항목을 포함해서 설명해주세요:
1. 회사의 전체 재무 상태 요약 (쉬운 말로 3-4문장)
2. 주요 특징 3가지 (예: 매출 추이, 수익성, 자산 상태)
3. 초보자 투자자가 알아야 할 주의사항

마크다운 형식으로 작성하되, 전문 용어는 쉬운 말로 설명해주세요.`;

    const result = await model.generateContent(prompt);
    const analysis = result.response.text();

    res.status(200).json({ analysis });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      error: error.message || 'AI 분석 중 오류가 발생했습니다'
    });
  }
};
