# View My Startup - Frontend

## 환경변수 설정

`.env.example`을 참고해 `.env` 파일을 생성해주세요.

```bash
cp .env.example .env
```

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `VITE_API_URL` | 백엔드 API 주소 | `http://localhost:3000` |

## 폴더 구조

```
src/
├── components/
│   ├── Header/        # 공통 네비게이션 헤더
│   └── Pagination/    # 공통 페이지네이션
├── pages/
│   └── ComparisonStatus/  # 비교 현황 페이지
├── data/
│   └── mockData.js    # 목 데이터 (API 연동 전 임시)
├── App.jsx
├── main.jsx
└── index.css
```

## 라우트

| 경로 | 페이지 |
|------|--------|
| `/` | 기업 전체 리스트 |
| `/select` | 나의 기업 비교 선택 |
| `/compare` | 비교 현황 |
| `/investment` | 투자 현황 |
| `/results` | 비교 결과 |
| `/detail` | 기업 상세 |

## 개발 서버 실행

```bash
npm run dev
```
