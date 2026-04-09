import { Routes, Route } from "react-router-dom";
import Header from './components/Header/Header';
import ComparisonStatus from './pages/ComparisonStatus/ComparisonStatus';

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/select" element={<Select />} />
          <Route path="/compare" element={<ComparisonStatus />} />
          <Route path="/investment" element={<Investment />} />
          <Route path="/results" element={<Results />} />
          <Route path="/detail" element={<Detail />} />
        </Routes>
      </main>
    </>
  );
}

function Home() {
  return <h1>기업 전체 리스트 조회 페이지</h1>;
}

function Select() {
  return <h1>나의 기업 비교 선택 페이지</h1>;
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
