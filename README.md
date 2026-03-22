# 재무 데이터 시각화 분석 서비스

누구나 쉽게 이해할 수 있는 재무 데이터 시각화 분석 서비스입니다. React + Vite로 구축되었으며, OpenDART API와 Gemini AI를 활용합니다.

## 주요 기능

### 1️⃣ 회사 검색
- corp.xml 데이터(3,864개 기업)에서 회사명, 영문명, 종목코드로 검색
- 실시간 필터링
- 인기 기업 빠른 액세스

### 2️⃣ 재무 데이터 시각화
- **매출액·영업이익·순이익 차트**: 회사의 수익 추이를 한눈에
- **자산·부채·자본 차트**: 재무상태표 구조 파악
- **수익성 지표**: 영업이익률과 순이익률 트렌드

### 3️⃣ OpenDART API 연동
- 사업연도 선택 (2015년 이후)
- 보고서 유형 선택 (사업보고서, 분기/반기보고서)
- 개별/연결 재무제표 전환

### 4️⃣ AI 재무 분석
- Gemini 2.0 Flash 모델 활용
- 초등학생도 이해할 수 있는 쉬운 언어로 분석
- 마크다운 형식의 포맷된 결과

## 기술 스택

```
Frontend:
- React 18.2
- Vite 5.0
- Tailwind CSS
- Recharts (차트)
- React Markdown

Backend/Deployment:
- Vercel Serverless Functions
- Node.js + Express (프록시)

API:
- OpenDART (한국 상장회사 재무정보)
- Google Generative AI (Gemini)
```

## 설치 및 실행

### 사전 준비

1. Node.js 18+ 설치
2. corp.xml 파일이 프로젝트 루트에 있는지 확인

### 개발 모드

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 프로덕션 빌드

```bash
npm run build
npm run preview
```

## 환경 설정

`.env` 파일 생성:

```env
OPENDART_API_KEY=your_opendart_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### Vercel 배포

1. GitHub에 프로젝트 푸시
2. Vercel Dashboard에서 프로젝트 연결
3. Environment Variables 설정:
   - `OPENDART_API_KEY`
   - `GEMINI_API_KEY`
4. Deploy

## 프로젝트 구조

```
finance/
├── .env                           # API 키 (로컬 전용)
├── .env.example                   # 키 샘플
├── .gitignore
├── package.json
├── vite.config.js
├── postcss.config.js
├── tailwind.config.js
├── vercel.json                    # Vercel 라우팅
├── index.html
├── corp.xml                       # 기업 데이터
├── scripts/
│   └── convert-corps.js          # XML → JSON 변환
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── data/
│   │   └── corps.json            # 변환된 기업 DB
│   ├── components/
│   │   ├── SearchPage.jsx        # 회사 검색
│   │   ├── FinancialDashboard.jsx # 대시보드
│   │   ├── AIAnalysis.jsx        # AI 분석
│   │   └── charts/
│   │       ├── RevenueChart.jsx  # 수익 차트
│   │       ├── BalanceChart.jsx  # 재무상태 차트
│   │       └── ProfitChart.jsx   # 수익률 차트
│   └── utils/
│       └── api.js                # API 호출
└── api/
    ├── financial.js              # OpenDART 프록시
    └── analyze.js                # Gemini 프록시
```

## 주요 파일 설명

### `scripts/convert-corps.js`
corp.xml을 JSON으로 변환하는 Node.js 스크립트
- xml2js 라이브러리 사용
- 3,864개 기업 데이터 파싱

### `src/components/SearchPage.jsx`
- 회사 검색 UI
- useMemo로 최적화된 필터링
- 실시간 검색 결과 표시

### `src/components/FinancialDashboard.jsx`
- 연도, 보고서, 재무제표 유형 선택
- 3가지 차트 동시 렌더링
- 에러 및 로딩 상태 처리

### `src/utils/api.js`
- `fetchFinancialData`: OpenDART API 호출
- `fetchAIAnalysis`: Gemini API 호출
- 데이터 정규화 함수 (차트 포맷 변환)

### `api/financial.js`
- POST /api/financial
- OpenDART API 프록시
- CORS 헤더 설정

### `api/analyze.js`
- POST /api/analyze
- Gemini AI 프록시
- 마크다운 분석 결과 반환

## 데이터 포맷

### OpenDART API 응답
```json
{
  "status": "000",
  "message": "정상",
  "list": [
    {
      "rcept_no": "접수번호",
      "bsns_year": "2024",
      "account_nm": "자산총계",
      "thstrm_amount": "339357244000000",
      "fs_div": "CFS",
      "sj_div": "BS"
    }
  ]
}
```

### AI 분석 입력
```json
{
  "companyName": "삼성전자",
  "year": 2024,
  "totalAssets": 339357244000000,
  "totalLiabilities": 91604067000000,
  "totalEquity": 247753177000000,
  "revenue": 243771415000000,
  "operatingProfit": 58886669000000,
  "netIncome": 44344857000000,
  "fsType": "연결재무제표"
}
```

## API 키 발급

### OpenDART API
- 사이트: https://opendart.fss.or.kr
- 신청: 공시정보 > 오픈API > 신청

### Gemini API
- 사이트: https://aistudio.google.com
- 무료 API 키 발급 가능

## 주의사항

⚠️ **배포 시 보안**
- API 키는 절대 클라이언트에 노출되지 않음
- Vercel 환경 변수에 안전하게 저장
- .gitignore에 .env 파일 포함 (필수)

## 트러블슈팅

### "조회된 데이타가 없습니다" 에러
- 선택한 연도/보고서 조합이 없을 수 있습니다
- 다른 연도나 보고서 타입 선택해보세요

### Gemini API 할당량 초과
- 일일 요청 한도를 초과했습니다
- 시간을 두고 다시 시도하세요

### CORS 에러
- Vercel 배포 시 /api 경로를 통해 요청해야 합니다
- 로컬에서는 개발 서버의 프록시 기능이 필수입니다

## 라이선스

MIT License

## 기여

개선 사항이나 버그 리포트는 이슈로 등록해주세요.

---

**마지막 업데이트**: 2026년 3월 22일
