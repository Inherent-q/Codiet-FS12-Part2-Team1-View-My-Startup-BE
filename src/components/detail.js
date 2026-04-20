import express from "express";
import prisma from "../client.js";

const router = express.Router();

router.get("/corporations/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const corporation = await prisma.corp.findUnique({
      where: { id: Number(id) },
    });
    if (!corporation)
      return res.status(404).json({ message: "기업을 찾을 수 없습니다." });
    res.json(corporation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/corporations/:id/investors", async (req, res) => {
  const { id } = req.params;
  try {
    const investors = await prisma.investor.findMany({
      where: { corpId: Number(id) },
      orderBy: { amount: "desc" },
    });
    res.status(200).json(investors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/corporations/:id/investors", async (req, res) => {
  const { id } = req.params;
  const { name, amount, password, comment } = req.body;
  try {
    const newInvestor = await prisma.investor.create({
      data: {
        name,
        amount,
        password,
        comment,
        corpId: Number(id),
      },
    });
    res.status(201).json(newInvestor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//삭제할 데이터 확인용
router.get("/investors/:investorId", async (req, res) => {
  const { investorId } = req.params;
  try {
    const investors = await prisma.investor.findMany({
      where: { id: Number(investorId) },
    });
    res.status(200).json(investors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/investors/:investorId", async (req, res) => {
  const { investorId } = req.params;
  try {
    await prisma.investor.delete({
      where: { id: Number(investorId) },
    });
    res.status(204).json("삭제 성공하였습니다.");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 투자자 수정
router.patch("/investors/:investorId", async (req, res) => {
  const { investorId } = req.params;
  const { name, amount, comment, password } = req.body;
  try {
    const investor = await prisma.investor.findUnique({
      where: { id: Number(investorId) },
    });
    if (!investor)
      return res.status(404).json({ message: "투자자를 찾을 수 없습니다." });

    if (investor.password !== password)
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });

    const updated = await prisma.investor.update({
      where: { id: Number(investorId) },
      data: { name, amount, comment },
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;
