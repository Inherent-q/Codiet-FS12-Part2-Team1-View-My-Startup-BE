import express from "express";
import dotenv from "dotenv";
import prisma from "./client.js";
import cors from "cors";
import corporationsRouter from "./components/corporations.js";
import selectionRouter from "./components/selection.js";

dotenv.config();
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/corporations", corporationsRouter);
app.use("/api", selectionRouter);

app.get("/", async (req, res) => {
  try {
    const corps = await prisma.corp.findMany();
    res.json(corps);
  } catch (err) {
    res.status(500).json({ error: "DB 연결 오류" });
  }
});

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
