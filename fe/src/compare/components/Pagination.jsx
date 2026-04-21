import '../style/Pagination.css';

const PAGE_WINDOW = 5;

function Pagination({ currentPage, totalPages, onPageChange }) {
  const half = Math.floor(PAGE_WINDOW / 2);
  let start = Math.max(1, currentPage - half);
  let end = start + PAGE_WINDOW - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - PAGE_WINDOW + 1);
  }

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="pagination">
      <button
        className="page-btn nav-btn"
        onClick={() => onPageChange(Math.max(1, currentPage - PAGE_WINDOW))}
        disabled={currentPage <= PAGE_WINDOW}
        aria-label="5페이지 앞"
      >
        &#60;&#60;
      </button>

      <button
        className="page-btn nav-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        &#60;
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={`page-btn ${currentPage === page ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="page-btn nav-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
      >
        &#62;
      </button>

      <button
        className="page-btn nav-btn"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + PAGE_WINDOW))}
        disabled={currentPage > totalPages - PAGE_WINDOW}
        aria-label="5페이지 뒤"
      >
        &#62;&#62;
      </button>
    </div>
  );
}

export default Pagination;
