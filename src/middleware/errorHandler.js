// 에러 핸들러 미들웨어
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  // Prisma 에러 처리
  if (err.code === "P2025") {
    // 데이터를 찾을 수 없는 경우
    return res.status(404).json({
      success: false,
      error: "요청한 데이터를 찾을 수 없습니다.",
    });
  }

  if (err.code === "P2003") {
    // 외래키 제약 조건 위반 (존재하지 않는 corpId 등)
    return res.status(400).json({
      success: false,
      error: "존재하지 않는 기업입니다. corpId를 확인해주세요.",
    });
  }

  // 기본 서버 에러
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "서버 오류가 발생했습니다.",
  });
};
