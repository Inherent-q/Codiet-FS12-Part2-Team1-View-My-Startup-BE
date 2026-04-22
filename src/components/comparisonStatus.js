import express from "express";
import prisma from "../client.js";

// 비교현황: 기업별 나의기업 선택 횟수 + 비교기업 선택 횟수 집계
const router = express.Router();

router.get("/comparison-status", async (req, res) => {
  try {
    const data = await prisma.corp.findMany({
      include: {
        _count: {
          select: {
            myselections: true,
            comparisonselections: true,
          },
        },
      },
      orderBy: { id: "asc" },
    });

    const result = data.map((corp) => ({
      id: corp.id,
      name: corp.name,
      description: corp.description,
      category: corp.category,
      img: corp.img,
      myCount: corp._count.myselections,
      compareCount: corp._count.comparisonselections,
    }));

    res.json(result);
  } catch (err) {
    console.error("comparison-status 오류:", err);
    res.status(500).json({ error: "서버 오류" });
  }
});

export default router;
