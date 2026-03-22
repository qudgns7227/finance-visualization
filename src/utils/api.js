const API_BASE = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:3001'
  : '';

// OpenDART API 호출
export async function fetchFinancialData(corpCode, bsnsYear, reprtCode) {
  try {
    const response = await fetch(`${API_BASE}/api/financial`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ corpCode, bsnsYear, reprtCode }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status !== '000') {
      throw new Error(data.message || '데이터 조회 실패');
    }

    return data.list || [];
  } catch (error) {
    console.error('Financial API 오류:', error);
    throw error;
  }
}

// Gemini AI 분석
export async function fetchAIAnalysis(corpName, financialData) {
  try {
    const response = await fetch(`${API_BASE}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ corpName, financialData }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.analysis;
  } catch (error) {
    console.error('Analysis API 오류:', error);
    throw error;
  }
}

// 재무 데이터 정규화 (차트 용도)
export function normalizeFinancialData(rawData, fsDivType = 'CFS') {
  const filtered = rawData.filter(
    item => item.fs_div === fsDivType && item.sj_div === 'BS'
  );

  const dataMap = {};

  filtered.forEach(item => {
    const year = item.bsns_year;
    
    if (!dataMap[year]) {
      dataMap[year] = {
        year: item.bsns_year,
        date: item.thstrm_dt?.split(' ')[0] || '',
      };
    }

    const amount = parseInt(item.thstrm_amount || 0);
    
    if (item.account_nm === '자산총계') {
      dataMap[year].totalAssets = amount;
    } else if (item.account_nm === '부채총계') {
      dataMap[year].totalLiabilities = amount;
    } else if (item.account_nm === '자본총계') {
      dataMap[year].totalEquity = amount;
    } else if (item.account_nm === '유동자산') {
      dataMap[year].currentAssets = amount;
    } else if (item.account_nm === '비유동자산') {
      dataMap[year].nonCurrentAssets = amount;
    }
  });

  return Object.values(dataMap)
    .sort((a, b) => a.year - b.year)
    .map(item => ({
      ...item,
      totalAssets: item.totalAssets || 0,
      totalLiabilities: item.totalLiabilities || 0,
      totalEquity: item.totalEquity || 0,
    }));
}

// 손익계산서 데이터 정규화
export function normalizeIncomeStatement(rawData, fsDivType = 'CFS') {
  const filtered = rawData.filter(
    item => item.fs_div === fsDivType && item.sj_div === 'IS'
  );

  const dataMap = {};

  filtered.forEach(item => {
    const year = item.bsns_year;
    
    if (!dataMap[year]) {
      dataMap[year] = { year: item.bsns_year };
    }

    const amount = parseInt(item.thstrm_amount || 0);
    
    if (item.account_nm === '매출액') {
      dataMap[year].revenue = amount;
    } else if (item.account_nm === '영업이익') {
      dataMap[year].operatingProfit = amount;
    } else if (item.account_nm === '당기순이익(손실)') {
      dataMap[year].netIncome = amount;
    }
  });

  return Object.values(dataMap)
    .sort((a, b) => a.year - b.year)
    .map(item => ({
      ...item,
      revenue: item.revenue || 0,
      operatingProfit: item.operatingProfit || 0,
      netIncome: item.netIncome || 0,
      operatingMargin: item.revenue 
        ? ((item.operatingProfit / item.revenue) * 100).toFixed(2)
        : 0,
      netMargin: item.revenue
        ? ((item.netIncome / item.revenue) * 100).toFixed(2)
        : 0,
    }));
}
