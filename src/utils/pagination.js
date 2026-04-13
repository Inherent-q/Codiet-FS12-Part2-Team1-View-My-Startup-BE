const ALLOWED_SORT_FIELDS = [
  "createdAt",
  "revenue",
  "accInvest",
  "hire",
  "name",
];

/**
 * 기업 전체 조회에만 해당
 * 클라이언트에서 전달된 query(page, limit, search, sort 등)를
 * Prisma에서 사용할 수 있는 조회 옵션(skip, take, where, orderBy)으로 변환하는 함수
 *
 * - pagination 처리 (skip, take)
 * - 검색어 기반 필터링 (where)
 * - 정렬 조건 설정 (orderBy)
 */
export function getPrismaQueryParams(query) {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const search = query.search?.trim() || undefined;
  const sortBy = ALLOWED_SORT_FIELDS.includes(query.sortBy)
    ? query.sortBy
    : "createdAt";
  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  return {
    skip: (page - 1) * limit,
    take: limit,
    where: search
      ? { name: { contains: search, mode: "insensitive" } }
      : undefined,
    orderBy: { [sortBy]: sortOrder },
  };
}

/**
 * 페이지네이션 있는 모든 API에서 재사용 가능
 * DB 조회 결과(data)와 전체 데이터 개수(totalCount)를 기반으로
 * 클라이언트에 전달할 pagination 응답 객체를 생성하는 함수
 *
 * - 현재 페이지, 전체 페이지
 * - 다음/이전 페이지 존재 여부
 */
export function buildPaginationResponse(data, totalCount, query) {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));

  const totalPages = Math.ceil(totalCount / limit);

  return {
    success: true,
    data,
    pagination: {
      currentPage: page,
      totalPages: totalPages,
      totalCount,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}
