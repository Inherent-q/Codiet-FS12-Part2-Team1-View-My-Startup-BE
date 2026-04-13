import { Routes, Route } from "react-router-dom";
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Select from './pages/Select/Select';
import ComparisonStatus from './pages/ComparisonStatus/ComparisonStatus';
import Investment from './pages/Investment/Investment';
import Results from './pages/Results/Results';
import Detail from './pages/Detail/Detail';

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
          <Route path="/detail/:id" element={<Detail />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
