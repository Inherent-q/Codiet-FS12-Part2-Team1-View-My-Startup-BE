import { Routes, Route } from "react-router-dom";
import GNB from './components/GNB';
import Home from './home/Home';
import Select from './select/Select';
import ComparisonStatus from './compare/ComparisonStatus';
import Results from './results/Results';
import Detail from './detail/Detail';

function App() {
  return (
    <>
      <GNB />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/select" element={<Select />} />
          <Route path="/compare" element={<ComparisonStatus />} />
          <Route path="/results" element={<Results />} />
          <Route path="/detail/:id" element={<Detail />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
