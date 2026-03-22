import { useState, useMemo } from 'react';
import corps from '../data/corps.json';

export default function SearchPage({ onSelectCompany }) {
  const [searchInput, setSearchInput] = useState('');

  const filteredResults = useMemo(() => {
    if (!searchInput.trim()) return [];

    const query = searchInput.toLowerCase();
    return corps
      .filter(corp => 
        corp.corp_name.toLowerCase().includes(query) ||
        corp.corp_eng_name.toLowerCase().includes(query) ||
        corp.stock_code.includes(query)
      )
      .slice(0, 50);
  }, [searchInput]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-8 px-4">
      <div className="w-full max-w-2xl">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            재무 데이터 시각화 분석
          </h1>
          <p className="text-gray-600 text-lg">
            회사명을 입력하여 재무 현황을 쉽게 분석해보세요
          </p>
        </div>

        {/* 검색 박스 */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="회사명, 영문명, 종목코드로 검색..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="input text-lg py-3 shadow-md focus:shadow-lg transition-shadow"
            autoFocus
          />
          <p className="text-gray-500 text-sm mt-2">
            {searchInput && filteredResults.length === 0
              ? '검색 결과가 없습니다'
              : searchInput && filteredResults.length > 0
              ? `${filteredResults.length}개의 결과`
              : '회사명을 입력하세요'}
          </p>
        </div>

        {/* 검색 결과 */}
        {filteredResults.length > 0 && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredResults.map((corp) => (
              <button
                key={corp.corp_code}
                onClick={() => onSelectCompany(corp)}
                className="w-full text-left card hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer transform hover:scale-102"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {corp.corp_name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {corp.corp_eng_name}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xs text-gray-500 font-mono">
                      CODE: {corp.corp_code}
                    </p>
                    <p className="text-sm font-semibold text-blue-600 mt-1">
                      {corp.stock_code}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* 인기 검색 */}
        {!searchInput && (
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              🌟 인기 기업
            </h2>
            <div className="space-y-2">
              {['삼성전자', 'SK하이닉스', 'LG전자', '현대자동차', '카카오'].map((name) => {
                const corp = corps.find(c => c.corp_name === name);
                return corp ? (
                  <button
                    key={corp.corp_code}
                    onClick={() => onSelectCompany(corp)}
                    className="w-full text-left card hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        {corp.corp_name}
                      </span>
                      <span className="text-blue-600 font-semibold">
                        {corp.stock_code}
                      </span>
                    </div>
                  </button>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
