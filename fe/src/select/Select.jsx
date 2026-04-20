import { MOCK_CORPS } from "../mock/mockCorps";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrCreateSessionId, getSessionId } from "../utils/sessionManager";
import searchIcon from "../assets/icons/search.svg";
import "./style/select.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const MAX_COMPARISON = 5;
const MODAL_PAGE_SIZE = 6;

const getCompanyName = (company) =>
  company?.name || company?.companyName || "이름 없음";
const getCompanyCategory = (company) =>
  company?.category || company?.industry || "업종 미정";
const getCompanyLogo = (company) => company?.logo || company?.img || "";

export default function SelectPage() {
  const navigate = useNavigate();

  const [myCompany, setMyCompany] = useState(null);
  const [comparisonCompanies, setComparisonCompanies] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);

  const [isMyCompanyModalOpen, setIsMyCompanyModalOpen] = useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);

  const [myCompanySearchKeyword, setMyCompanySearchKeyword] = useState("");
  const [comparisonSearchKeyword, setComparisonSearchKeyword] = useState("");
  const [selectedComparisonCompanies, setSelectedComparisonCompanies] =
    useState(new Set());

  const [comparisonModalPage, setComparisonModalPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        getOrCreateSessionId();
        await Promise.all([
          fetchAllCompanies(),
          fetchMyCompany(),
          fetchComparisonCompanies(),
        ]);
      } catch (err) {
        console.error(err);
        setError("초기 데이터 로딩에 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const fetchAllCompanies = async () => {
    if (USE_MOCK) {
      setAllCompanies(MOCK_CORPS);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/corporations`);
      if (!response.ok) throw new Error("기업 목록 조회 실패");
      const payload = await response.json();
      const data = Array.isArray(payload) ? payload : payload?.data;
      setAllCompanies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("기업 목록 API 실패, 목업 데이터로 대체합니다.", err);
      setAllCompanies(MOCK_CORPS);
    }
  };

  const fetchMyCompany = async () => {
    try {
      const sessionId = getSessionId();
      if (!sessionId) return;
      const response = await fetch(
        `${API_BASE_URL}/my-selection?userSessionId=${sessionId}`,
      );

      if (!response.ok) return;

      const payload = await response.json();
      if (payload?.success && payload?.data?.corp) {
        setMyCompany(payload.data.corp);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComparisonCompanies = async () => {
    try {
      const sessionId = getSessionId();
      if (!sessionId) return;
      const response = await fetch(
        `${API_BASE_URL}/comparison-selections?userSessionId=${sessionId}`,
      );

      if (!response.ok) return;

      const payload = await response.json();
      if (payload?.success && Array.isArray(payload.data)) {
        setComparisonCompanies(
          payload.data.map((item) => ({
            ...item.corp,
            _selectionId: item.id,
          })),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addMyCompany = (company) => {
    setMyCompany(company);
    setIsMyCompanyModalOpen(false);
    setMyCompanySearchKeyword("");
    setError("");
  };

  const clearMyCompany = () => {
    setMyCompany(null);
    setComparisonCompanies([]);
    setSelectedComparisonCompanies(new Set());
    setError("");
  };

  const addComparisonCompanies = (companyIds) => {
    if (!companyIds.length) return;

    const selected = allCompanies
      .filter((company) => companyIds.includes(company.id))
      .map((company) => ({ ...company, _selectionId: `local-${company.id}` }));

    setComparisonCompanies((prev) => {
      const prevIds = new Set(prev.map((c) => c.id));
      const merged = [...prev];
      selected.forEach((c) => {
        if (!prevIds.has(c.id)) merged.push(c);
      });
      return merged;
    });

    setSelectedComparisonCompanies(new Set());
    setComparisonSearchKeyword("");
    setComparisonModalPage(1);
    setIsComparisonModalOpen(false);
    setError("");
  };

  const removeComparisonCompany = (companyId) => {
    setComparisonCompanies((prev) => prev.filter((c) => c.id !== companyId));
    setSelectedComparisonCompanies((prev) => {
      const next = new Set(prev);
      next.delete(companyId);
      return next;
    });
    setError("");
  };

  const resetAllSelections = () => {
    setMyCompany(null);
    setComparisonCompanies([]);
    setSelectedComparisonCompanies(new Set());
    setError("");
  };

  const handleCompareSubmit = async () => {
    if (!myCompany || comparisonCompanies.length === 0) return;

    try {
      setIsLoading(true);
      setError("");

      const sessionId = getSessionId() || getOrCreateSessionId();

      const mySelectionRes = await fetch(`${API_BASE_URL}/my-selection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userSessionId: sessionId,
          corpId: myCompany.id,
        }),
      });

      if (!mySelectionRes.ok) {
        throw new Error("나의 기업 저장 실패");
      }

      const mySelectionPayload = await mySelectionRes.json();
      if (!mySelectionPayload?.success) {
        throw new Error("나의 기업 저장 응답 실패");
      }

      const comparisonSelectionRes = await fetch(
        `${API_BASE_URL}/comparison-selections`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userSessionId: sessionId,
            corpIds: comparisonCompanies.map((company) => company.id),
          }),
        },
      );

      if (!comparisonSelectionRes.ok) {
        throw new Error("비교 기업 저장 실패");
      }

      const comparisonSelectionPayload = await comparisonSelectionRes.json();
      if (!comparisonSelectionPayload?.success) {
        throw new Error("비교 기업 저장 응답 실패");
      }

      navigate("/results");
    } catch (err) {
      console.error(err);
      setError(
        "기업 비교 데이터를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openMyCompanyModal = () => {
    setMyCompanySearchKeyword("");
    setIsMyCompanyModalOpen(true);
  };

  const openComparisonModal = () => {
    setSelectedComparisonCompanies(new Set());
    setComparisonSearchKeyword("");
    setComparisonModalPage(1);
    setIsComparisonModalOpen(true);
  };

  const filteredMyCompanyCandidates = useMemo(() => {
    const keyword = myCompanySearchKeyword.trim().toLowerCase();
    if (!keyword) return allCompanies.slice(0, 20);

    return allCompanies.filter((company) =>
      `${getCompanyName(company)} ${getCompanyCategory(company)}`
        .toLowerCase()
        .includes(keyword),
    );
  }, [allCompanies, myCompanySearchKeyword]);

  const filteredComparisonCandidates = useMemo(() => {
    const keyword = comparisonSearchKeyword.trim().toLowerCase();

    return allCompanies.filter((company) => {
      if (myCompany?.id === company.id) return false;

      if (!keyword) return true;

      return `${getCompanyName(company)} ${getCompanyCategory(company)}`
        .toLowerCase()
        .includes(keyword);
    });
  }, [allCompanies, comparisonSearchKeyword, myCompany]);

  const pagedComparisonCandidates = useMemo(() => {
    const start = (comparisonModalPage - 1) * MODAL_PAGE_SIZE;
    return filteredComparisonCandidates.slice(start, start + MODAL_PAGE_SIZE);
  }, [filteredComparisonCandidates, comparisonModalPage]);

  const comparisonTotalPages = Math.max(
    1,
    Math.ceil(filteredComparisonCandidates.length / MODAL_PAGE_SIZE),
  );

  const visiblePageNumbers = useMemo(() => {
    const maxVisible = 5;

    if (comparisonTotalPages <= maxVisible) {
      return Array.from({ length: comparisonTotalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, comparisonModalPage - half);
    let end = start + maxVisible - 1;

    if (end > comparisonTotalPages) {
      end = comparisonTotalPages;
      start = end - maxVisible + 1;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [comparisonModalPage, comparisonTotalPages]);

  useEffect(() => {
    if (comparisonModalPage > comparisonTotalPages) {
      setComparisonModalPage(comparisonTotalPages);
    }
  }, [comparisonModalPage, comparisonTotalPages]);

  const toggleComparisonCandidate = (companyId) => {
    const isAlreadyInComparison = comparisonCompanies.some(
      (c) => c.id === companyId,
    );
    if (isAlreadyInComparison) return;

    setSelectedComparisonCompanies((prev) => {
      const next = new Set(prev);

      if (next.has(companyId)) {
        next.delete(companyId);
        return next;
      }

      const currentTotal = comparisonCompanies.length + next.size;
      if (currentTotal >= MAX_COMPARISON) {
        setError(
          `비교 기업은 최대 ${MAX_COMPARISON}개까지 선택할 수 있습니다.`,
        );
        return prev;
      }

      next.add(companyId);
      setError("");
      return next;
    });
  };

  return (
    <div className="select-page">
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button type="button" onClick={() => setError("")}>
            닫기
          </button>
        </div>
      )}

      <section className="compare-section">
        <div className="section-title-row">
          <h2 className="section-title">나의 기업을 선택해 주세요!</h2>
          {myCompany && (
            <button
              type="button"
              className="primary-pill-btn"
              onClick={resetAllSelections}
              disabled={isLoading}
            >
              <span className="restart-icon" aria-hidden="true">
                ↻
              </span>
              전체 초기화
            </button>
          )}
        </div>

        <div className="my-company-box">
          {myCompany ? (
            <div className="my-company-content">
              <button
                type="button"
                className="my-company-cancel-link"
                onClick={clearMyCompany}
                disabled={isLoading}
              >
                선택 취소
              </button>
              <img
                src={getCompanyLogo(myCompany)}
                alt={getCompanyName(myCompany)}
                className="company-avatar-large"
              />
              <p className="company-name">{getCompanyName(myCompany)}</p>
              <p className="company-category">
                {getCompanyCategory(myCompany)}
              </p>
            </div>
          ) : (
            <div className="my-company-empty">
              <button
                type="button"
                className="icon-circle-btn"
                onClick={openMyCompanyModal}
                disabled={isLoading}
              >
                +
              </button>
              <p className="empty-label">기업 추가</p>
            </div>
          )}
        </div>
      </section>

      {myCompany && (
        <section className="compare-section">
          <div className="section-title-row">
            <h2 className="section-title">
              어떤 기업이 궁금하세요? (최대 5개)
            </h2>
            <button
              type="button"
              className="primary-pill-btn"
              onClick={openComparisonModal}
              disabled={
                isLoading || comparisonCompanies.length >= MAX_COMPARISON
              }
            >
              기업 추가하기
            </button>
          </div>

          <div className="comparison-cards-area">
            {comparisonCompanies.length === 0 ? (
              <div className="comparison-empty-state">
                아직 추가한 기업이 없어요,
                <br />
                버튼을 눌러 기업을 추가해보세요!
              </div>
            ) : (
              <div className="comparison-grid">
                {comparisonCompanies.map((company) => (
                  <article key={company.id} className="comparison-card">
                    <button
                      type="button"
                      className="card-remove-btn"
                      onClick={() => removeComparisonCompany(company.id)}
                      disabled={isLoading}
                      aria-label={`${getCompanyName(company)} 삭제`}
                    >
                      -
                    </button>
                    <img
                      src={getCompanyLogo(company)}
                      alt={getCompanyName(company)}
                      className="company-avatar"
                    />
                    <p className="company-name">{getCompanyName(company)}</p>
                    <p className="company-category">
                      {getCompanyCategory(company)}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <button
        type="button"
        className="compare-submit-btn"
        disabled={!myCompany || comparisonCompanies.length === 0 || isLoading}
        onClick={handleCompareSubmit}
      >
        기업 비교하기
      </button>

      {isMyCompanyModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsMyCompanyModalOpen(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">나의 기업 선택하기</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsMyCompanyModalOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-search-row">
                <img
                  src={searchIcon}
                  alt=""
                  className="modal-search-icon"
                  aria-hidden="true"
                />
                <input
                  className="modal-search-input"
                  type="text"
                  placeholder="검색어를 입력해주세요"
                  value={myCompanySearchKeyword}
                  onChange={(e) => setMyCompanySearchKeyword(e.target.value)}
                />
                {myCompanySearchKeyword && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => setMyCompanySearchKeyword("")}
                  >
                    ×
                  </button>
                )}
              </div>

              <p className="modal-section-title">최근 선택한 기업</p>
              <div className="modal-list">
                {filteredMyCompanyCandidates.slice(0, 6).map((company) => (
                  <div key={company.id} className="modal-row">
                    <div className="modal-row-left">
                      <img
                        src={getCompanyLogo(company)}
                        alt={getCompanyName(company)}
                        className="modal-logo"
                      />
                      <div className="modal-meta">
                        <p className="modal-row-title">
                          {getCompanyName(company)}
                        </p>
                        <p className="modal-row-sub">
                          {getCompanyCategory(company)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`modal-row-action ${myCompany?.id === company.id ? "is-completed" : ""}`}
                      onClick={() => addMyCompany(company)}
                      disabled={isLoading || myCompany?.id === company.id}
                    >
                      {myCompany?.id === company.id ? "선택 완료" : "선택하기"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {isComparisonModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsComparisonModalOpen(false)}
        >
          <div
            className="modal-content modal-content-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="modal-title">비교할 기업 선택하기</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsComparisonModalOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-search-row">
                <img
                  src={searchIcon}
                  alt=""
                  className="modal-search-icon"
                  aria-hidden="true"
                />
                <input
                  className="modal-search-input"
                  type="text"
                  placeholder="검색어를 입력해주세요"
                  value={comparisonSearchKeyword}
                  onChange={(e) => {
                    setComparisonSearchKeyword(e.target.value);
                    setComparisonModalPage(1);
                  }}
                />
                {comparisonSearchKeyword && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => {
                      setComparisonSearchKeyword("");
                      setComparisonModalPage(1);
                    }}
                  >
                    ×
                  </button>
                )}
              </div>

              <p className="modal-section-title">
                선택한 기업 (
                {comparisonCompanies.length + selectedComparisonCompanies.size})
              </p>
              <div className="modal-list selected-list">
                {comparisonCompanies.length === 0 &&
                  selectedComparisonCompanies.size === 0 && (
                    <p className="modal-empty">아직 선택한 기업이 없습니다.</p>
                  )}

                {comparisonCompanies.map((company) => (
                  <div key={`selected-${company.id}`} className="modal-row">
                    <div className="modal-row-left">
                      <img
                        src={getCompanyLogo(company)}
                        alt={getCompanyName(company)}
                        className="modal-logo"
                      />
                      <div className="modal-meta">
                        <p className="modal-row-title">
                          {getCompanyName(company)}
                        </p>
                        <p className="modal-row-sub">
                          {getCompanyCategory(company)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="modal-row-action is-completed"
                      disabled
                    >
                      선택 완료
                    </button>
                  </div>
                ))}

                {Array.from(selectedComparisonCompanies).map((companyId) => {
                  const company = allCompanies.find(
                    (item) => item.id === companyId,
                  );
                  if (!company) return null;

                  return (
                    <div key={`pending-${companyId}`} className="modal-row">
                      <div className="modal-row-left">
                        <img
                          src={getCompanyLogo(company)}
                          alt={getCompanyName(company)}
                          className="modal-logo"
                        />
                        <div className="modal-meta">
                          <p className="modal-row-title">
                            {getCompanyName(company)}
                          </p>
                          <p className="modal-row-sub">
                            {getCompanyCategory(company)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="modal-row-action is-selected"
                        onClick={() => toggleComparisonCandidate(companyId)}
                      >
                        선택 해제
                      </button>
                    </div>
                  );
                })}
              </div>

              <p className="modal-section-title">
                검색 결과 ({filteredComparisonCandidates.length})
              </p>
              <div className="modal-list">
                {pagedComparisonCandidates.length === 0 ? (
                  <p className="modal-empty">검색 결과가 없습니다.</p>
                ) : (
                  pagedComparisonCandidates.map((company) => {
                    const isAlreadySelected = comparisonCompanies.some(
                      (c) => c.id === company.id,
                    );
                    const isSelectedInModal = selectedComparisonCompanies.has(
                      company.id,
                    );

                    return (
                      <div key={company.id} className="modal-row">
                        <div className="modal-row-left">
                          <img
                            src={getCompanyLogo(company)}
                            alt={getCompanyName(company)}
                            className="modal-logo"
                          />
                          <div className="modal-meta">
                            <p className="modal-row-title">
                              {getCompanyName(company)}
                            </p>
                            <p className="modal-row-sub">
                              {getCompanyCategory(company)}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          className={`modal-row-action ${isAlreadySelected ? "is-completed" : isSelectedInModal ? "is-selected" : ""}`}
                          onClick={() => toggleComparisonCandidate(company.id)}
                          disabled={isAlreadySelected}
                        >
                          {isAlreadySelected
                            ? "선택 완료"
                            : isSelectedInModal
                              ? "선택 해제"
                              : "선택하기"}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              <p className="modal-hint">
                *비교할 기업은 최대 5개까지 선택 가능합니다.
              </p>

              <div className="select-modal-footer">
                <div className="select-pagination">
                  <button
                    type="button"
                    className="select-page-btn"
                    onClick={() =>
                      setComparisonModalPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={comparisonModalPage === 1}
                  >
                    {"<"}
                  </button>
                  {visiblePageNumbers.map((page) => (
                    <button
                      key={page}
                      type="button"
                      className={`select-page-btn ${page === comparisonModalPage ? "select-is-active" : ""}`}
                      onClick={() => setComparisonModalPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="select-page-btn"
                    onClick={() =>
                      setComparisonModalPage((prev) =>
                        Math.min(comparisonTotalPages, prev + 1),
                      )
                    }
                    disabled={comparisonModalPage === comparisonTotalPages}
                  >
                    {">"}
                  </button>
                </div>
                <button
                  type="button"
                  className="confirm-add-btn"
                  onClick={() =>
                    addComparisonCompanies(
                      Array.from(selectedComparisonCompanies),
                    )
                  }
                  disabled={selectedComparisonCompanies.size === 0 || isLoading}
                >
                  기업 추가하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
