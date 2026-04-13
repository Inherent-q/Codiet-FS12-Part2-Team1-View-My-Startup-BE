import { Router } from "express";
import prisma from "../client.js";
import {
  getPrismaQueryParams,
  buildPaginationResponse,
} from "../utils/pagination.js";

const router = Router();

// GET /corps
router.get("/", async (req, res) => {
  try {
    const params = getPrismaQueryParams(req.query);

    const [data, totalCount] = await prisma.$transaction([
      prisma.corp.findMany(params), // 현재 페이지 데이터
      prisma.corp.count({ where: params.where }),
    ]);

    res.status(200).json(buildPaginationResponse(data, totalCount, req.query));
  } catch (error) {
    console.error("[GET /api/corporations] Error:", error);

    res.status(500).json({
      success: false,
      code: "SERVER_ERROR",
      message: "기업 목록을 불러오는 중 서버 에러가 발생했습니다.",
    });
  }
});

export default router;
