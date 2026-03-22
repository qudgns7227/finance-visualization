import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// OpenDART API 프록시
app.post('/api/financial', async (req, res) => {
  const { corpCode, bsnsYear, reprtCode } = req.body;

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
});

// Gemini API 프록시
app.post('/api/analyze', async (req, res) => {
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
});

app.listen(PORT, () => {
  console.log(`✓ API 서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});
