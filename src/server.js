import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import detailRouter from "./components/detail.js"; // 추가 (영미)
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

// 에러 핸들러 추가 (종찬)
app.use(errorHandler);

// 새로운 라우트 추가:투자결과 투자자 추가하기 (임주연)
app.use("/api", investPostRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
