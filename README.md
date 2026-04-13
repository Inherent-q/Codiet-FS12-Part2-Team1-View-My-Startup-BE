# View My Startup

스타트업 비교 및 투자 현황을 확인할 수 있는 서비스입니다.

## 프로젝트 구조

```
├── fe/          # React + Vite 프론트엔드
├── be/          # Express + Prisma 백엔드
├── package.json # 루트 워크스페이스 설정
└── .gitignore
```

## 시작하기

### 1. 패키지 설치
```bash
npm install
```

### 2. 환경변수 설정
```bash
# fe/.env.example을 참고해 fe/.env 파일 생성
cp fe/.env.example fe/.env
```

### 3. 개발 서버 실행
```bash
# fe/be 동시 실행
npm run dev

# fe만 실행
npm run dev -w fe

# be만 실행
npm run dev -w be
```

## 기술 스택

| | 기술 |
|---|---|
| Frontend | React 19, Vite, React Router v6 |
| Backend | Express 5, Prisma 7 |
| DB | PostgreSQL |
