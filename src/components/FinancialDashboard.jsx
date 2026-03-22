import { useState, useEffect } from 'react';
import { fetchFinancialData, normalizeFinancialData, normalizeIncomeStatement } from '../utils/api';
import RevenueChart from './charts/RevenueChart';
import BalanceChart from './charts/BalanceChart';
import ProfitChart from './charts/ProfitChart';
import AIAnalysis from './AIAnalysis';

const REPORT_CODES = {
  '11011': '사업보고서',
  '11013': '1분기보고서',
  '11012': '반기보고서',
  '11014': '3분기보고서',
};

export default function FinancialDashboard({ company, onBack }) {
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2022);
  const [selectedReport, setSelectedReport] = useState('11011');
  const [fsDiv, setFsDiv] = useState('CFS');
  const [chartData, setChartData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [allRawData, setAllRawData] = useState([]);
  const [error, setError] = useState(null);

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 - i);

  useEffect(() => {
    loadFinancialData();
  }, [company, selectedYear, selectedReport]);

  const loadFinancialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFinancialData(
        company.corp_code,
        selectedYear,
        selectedReport
      );

      if (data.length === 0) {
        setError(`${selectedYear}년 ${REPORT_CODES[selectedReport]} 데이터를 찾을 수 없습니다. 다른 연도나 보고서를 시도해주세요.`);
        setAllRawData([]);
        setChartData([]);
        setIncomeData([]);
      } else {
        setAllRawData(data);
        setChartData(normalizeFinancialData(data, fsDiv));
        setIncomeData(normalizeIncomeStatement(data, fsDiv));
      }
    } catch (err) {
      setError(`오류 발생: ${err.message}`);
      console.error('데이터 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFsDivChange = (newFsDiv) => {
    setFsDiv(newFsDiv);
    setChartData(normalizeFinancialData(allRawData, newFsDiv));
    setIncomeData(normalizeIncomeStatement(allRawData, newFsDiv));
  };

  return (
    <div className="min-h-screen pb-12">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-4">
        <div className="container-fluid">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all"
          >
            ← 검색으로 돌아가기
          </button>

          <h1 className="text-3xl font-bold mb-2">{company.corp_name}</h1>
          <p className="text-blue-100">
            CODE: {company.corp_code} | STOCK: {company.stock_code}
          </p>
        </div>
      </div>

      {/* 컨트롤 패널 */}
      <div className="container-fluid mt-8 mb-8">
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 연도 선택 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                사업연도
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="input"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}년</option>
                ))}
              </select>
            </div>

            {/* 보고서 유형 선택 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                보고서 유형
              </label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="input"
              >
                {Object.entries(REPORT_CODES).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </div>

            {/* 재무제표 타입 선택 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                재무제표
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleFsDivChange('CFS')}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all ${
                    fsDiv === 'CFS'
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  연결
                </button>
                <button
                  onClick={() => handleFsDivChange('OFS')}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all ${
                    fsDiv === 'OFS'
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  별도
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="container-fluid mb-8">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <p className="font-semibold">⚠️ 데이터 조회 실패</p>
            <p className="text-sm mt-1">{error}</p>
            <p className="text-xs mt-3 text-red-600">💡 팁: 2020-2022년의 사업보고서 데이터는 대부분 있습니다. 다른 연도를 시도해보세요.</p>
          </div>
        </div>
      )}

      {/* 로딩 상태 */}
      {loading && (
        <div className="container-fluid mb-8">
          <div className="card text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">재무 데이터 로드 중...</p>
              <p className="text-gray-500 text-sm mt-2">OpenDART에서 데이터를 조회하고 있습니다</p>
            </div>
          </div>
        </div>
      )}

      {/* 차트 섹션 */}
      {!loading && chartData.length > 0 && (
        <div className="container-fluid space-y-8 mb-8">
          <div className="card">
            <RevenueChart data={incomeData} />
          </div>

          <div className="card">
            <BalanceChart data={chartData} />
          </div>

          <div className="card">
            <ProfitChart data={incomeData} />
          </div>
        </div>
      )}

      {/* AI 분석 섹션 - 일시적으로 비활성화 */}
      {false && !loading && chartData.length > 0 && (
        <div className="container-fluid mb-8">
          <AIAnalysis 
            company={company}
            financialData={{
              balance: chartData,
              income: incomeData,
              fsDiv: fsDiv === 'CFS' ? '연결재무제표' : '재무제표'
            }}
          />
        </div>
      )}
      
      {/* AI 분석 사용 불가 안내 */}
      {!loading && chartData.length > 0 && (
        <div className="container-fluid mb-8">
          <div className="card p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-900">
              <span className="font-semibold">💡 AI 분석 정보:</span> Gemini 무료 API는 일일 한도가 있어 현재 사용할 수 없습니다. 
              본 서비스는 Vercel에 배포될 때 정상 작동합니다.
            </p>
          </div>
        </div>
      )}

      {/* 데이터 없음 메시지 */}
      {!loading && chartData.length === 0 && !error && (
        <div className="container-fluid">
          <div className="card text-center py-12 text-gray-500">
            <p className="text-lg">해당 조건의 재무 데이터가 없습니다.</p>
            <p className="text-sm mt-2">다른 연도나 보고서를 선택해주세요.</p>
          </div>
        </div>
      )}
    </div>
  );
}
