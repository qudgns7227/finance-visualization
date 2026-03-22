import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { fetchAIAnalysis } from '../utils/api';

export default function AIAnalysis({ company, financialData }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 데이터 요약
      const balanceLatest = financialData.balance[financialData.balance.length - 1];
      const incomeLatest = financialData.income[financialData.income.length - 1];

      const summary = {
        companyName: company.corp_name,
        year: balanceLatest?.year,
        totalAssets: balanceLatest?.totalAssets,
        totalLiabilities: balanceLatest?.totalLiabilities,
        totalEquity: balanceLatest?.totalEquity,
        revenue: incomeLatest?.revenue,
        operatingProfit: incomeLatest?.operatingProfit,
        netIncome: incomeLatest?.netIncome,
        operatingMargin: incomeLatest?.operatingMargin,
        netMargin: incomeLatest?.netMargin,
        fsType: financialData.fsDiv,
      };

      const result = await fetchAIAnalysis(company.corp_name, summary);
      setAnalysis(result);
      setExpanded(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🤖 AI 재무 분석
          </h2>
          <p className="text-gray-600">
            Gemini AI가 {company.corp_name}의 재무 상황을 초등학생도 쉽게 이해할 수 있게 설명해드립니다.
          </p>
        </div>
      </div>

      {!analysis && !expanded ? (
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="btn-primary w-full py-3 text-lg font-semibold disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span> 분석 중...
            </span>
          ) : (
            '🚀 AI 분석 시작'
          )}
        </button>
      ) : null}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="font-semibold">⚠️ 분석 오류</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {analysis && (
        <div className="mt-6 prose prose-sm max-w-none">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {analysis}
            </ReactMarkdown>
          </div>
          
          <button
            onClick={() => {
              setAnalysis(null);
              setExpanded(false);
            }}
            className="mt-6 btn-secondary w-full py-2"
          >
            다시 분석하기
          </button>
        </div>
      )}

      {loading && expanded && (
        <div className="mt-6 p-6 text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
            <p className="text-gray-600">AI 분석 중입니다...</p>
            <p className="text-sm text-gray-500 mt-2">약 10초 정도 소요됩니다</p>
          </div>
        </div>
      )}
    </div>
  );
}
