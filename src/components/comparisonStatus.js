import express from "express";
import prisma from "../client.js";
import {
  getPrismaQueryParams,
  buildPaginationResponse,
} from "../utils/pagination.js";

const router = express.Router();

const COMPARISON_SORT_MAP = {
  myCount: { myselections: { _count: undefined } },
  compareCount: { comparisonselections: { _count: undefined } },
};

router.get("/comparison-status", async (req, res) => {
  try {
    const { skip, take } = getPrismaQueryParams(req.query);

    const sortBy = req.query.sortBy || "myCount";
    const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";

    const orderBy = COMPARISON_SORT_MAP[sortBy]
      ? { [Object.keys(COMPARISON_SORT_MAP[sortBy])[0]]: { _count: sortOrder } }
      : { myselections: { _count: "desc" } }; // 알 수 없는 값은 기본값

    const [data, totalCount] = await Promise.all([
      prisma.corp.findMany({
        include: {
          _count: {
            select: {
              myselections: true,
              comparisonselections: true,
            },
          },
        },
        orderBy,
        skip,
        take,
      }),
      prisma.corp.count(),
    ]);

    const result = data.map((corp) => ({
      id: corp.id,
      name: corp.name,
      description: corp.description,
      category: corp.category,
      img: corp.img,
      myCount: corp._count.myselections,
      compareCount: corp._count.comparisonselections,
    }));

    res.json(buildPaginationResponse(result, totalCount, req.query));
  } catch (err) {
    console.error("comparison-status 오류:", err);
    res.status(500).json({ error: "서버 오류" });
  }
});

export default router;
