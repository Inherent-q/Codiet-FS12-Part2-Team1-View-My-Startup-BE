import { useState, useMemo, useEffect } from 'react';
import Pagination from './components/Pagination';
import CompanyCard from './components/CompanyCard';
import { MOCK_COMPANIES } from './controller/mockData';
import './style/ComparisonStatus.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const ITEMS_PER_PAGE = 10;

const SORT_OPTIONS = [
  { value: 'myCount-desc',      label: '나의 기업 선택 횟수 높은순' },
  { value: 'myCount-asc',       label: '나의 기업 선택 횟수 낮은순' },
  { value: 'compareCount-desc', label: '비교 기업 선택 횟수 높은순' },
  { value: 'compareCount-asc',  label: '비교 기업 선택 횟수 낮은순' },
];

function ComparisonStatus() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState('myCount-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/comparison-status`)
      .then((res) => {
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setCompanies(Array.isArray(data) ? data : (data.data ?? []));
        setLoading(false);
      })
      .catch((err) => {
        console.warn('API 연결 실패, mock 데이터 사용:', err.message);
        setCompanies(MOCK_COMPANIES);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sortedData = useMemo(() => {
    return [...companies].sort((a, b) => {
      switch (sortType) {
        case 'myCount-desc':      return b.myCount - a.myCount;
        case 'myCount-asc':       return a.myCount - b.myCount;
        case 'compareCount-desc': return b.compareCount - a.compareCount;
        case 'compareCount-asc':  return a.compareCount - b.compareCount;
        default: return 0;
      }
    });
  }, [companies, sortType]);

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedData.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedData, currentPage]);

  const handleSortChange = (e) => {
    setSortType(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="comparison-status">
        <p style={{ color: '#fff', textAlign: 'center', paddingTop: '80px' }}>불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="comparison-status">
      <div className="cs-header">
        <h1 className="cs-title">비교 현황</h1>
        <div className="cs-sort">
          <select
            className="sort-select"
            value={sortType}
            onChange={handleSortChange}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="cs-table-wrapper">
        <table className="cs-table">
          <thead>
            <tr>
              <th className="col-rank">순위</th>
              <th className="col-name">기업 명</th>
              <th className="col-desc">기업 소개</th>
              <th className="col-category">카테고리</th>
              <th className="col-my">나의 기업 선택 횟수</th>
              <th className="col-compare">비교 기업 선택 횟수</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((company, index) => {
              const globalRank = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
              return (
                <CompanyCard key={company.id} company={company} rank={globalRank} />
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {showScrollTop && (
        <button
          className="scroll-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default ComparisonStatus;
