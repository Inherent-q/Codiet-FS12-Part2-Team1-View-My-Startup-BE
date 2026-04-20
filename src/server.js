import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import prisma from "./client.js";
import detailRouter from "./components/detail.js";
import corpsRouter from "./components/corporations.js";
import selectionRoutes from "./components/selection.js"; // 추가 (종찬)
import { errorHandler } from "./middleware/errorHandler.js"; // 추가 (종찬)
import investmentRoutes from "./components/investController.js"; // (주연)
import investPostRoutes from "./components/resultInvestPost.js";

dotenv.config();
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/corporations", corpsRouter);

//새로운 라우터 추가 (주연)
app.use("/api", investmentRoutes);

// 새로운 라우트 추가 (영미)
app.use("/api", detailRouter);

// 새로운 라우트 추가 (종찬)
app.use("/api", selectionRoutes);

app.use("/api", investmentRoutes);

// 비교현황: 기업별 나의기업 선택 횟수 + 비교기업 선택 횟수 집계
app.get("/api/comparison-status", async (req, res) => {
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
      img: corp.img ?? null,
      myCount: corp._count.myselections,
      compareCount: corp._count.comparisonselections,
    }));

    res.json(result);
  } catch (err) {
    console.error("comparison-status 오류:", err);
    res.status(500).json({ error: "서버 오류" });
  }
});

// 에러 핸들러 추가 (종찬)
app.use(errorHandler);

// 새로운 라우트 추가:투자결과 투자자 추가하기 (임주연)
app.use("/api", investPostRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
