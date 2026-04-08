import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/select" element={<Select />} />
      <Route path="/compare" element={<Compare />} />
      <Route path="/investment" element={<Investment />} />
      <Route path="/results" element={<Results />} />
      <Route path="/detail" element={<Detail />} />
    </Routes>
  );
}

function Home() {
  return <h1>기업 전체 리스트 조회 페이지</h1>;
}

function Select() {
  return <h1>나의 기업 비교 선택 페이지</h1>;
}

function Compare() {
  return <h1>비교 현황 페이지</h1>;
}
function Investment() {
  return <h1>투자 현황 페이지</h1>;
}
function Results() {
  return <h1>비교 결과 페이지</h1>;
}
function Detail() {
  return <h1>기업상세 페이지</h1>;
}

export default App;
