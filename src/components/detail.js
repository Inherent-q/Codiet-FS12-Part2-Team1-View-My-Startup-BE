import express from "express";
import prisma from "../client.js";
import { buildPaginationResponse } from "../utils/pagination.js";

const router = express.Router();

router.get("/corporations/:id", async (req, res) => {
  const numericId = Number(req.params.id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    return res.status(400).json({ message: "유효하지 않은 기업 ID입니다." });
  }

  try {
    const [corp, aggregate, allCorps] = await prisma.$transaction([
      prisma.corp.findUnique({ where: { id: numericId } }),
      prisma.investor.aggregate({
        where: { corpId: numericId },
        _sum: { amount: true },
        _count: { id: true },
      }),
      prisma.corp.findMany({
        select: {
          id: true,
          accInvest: true,
          investors: { select: { amount: true } },
        },
      }),
    ]);

    if (!corp) return res.status(404).json({ message: "기업을 찾을 수 없습니다." });

    const vms = Number(aggregate._sum.amount ?? 0);
    const investorCount = aggregate._count.id;
    const accInvestRank =
      allCorps.filter((c) => Number(c.accInvest) > Number(corp.accInvest)).length + 1;
    const vmsRank =
      allCorps.filter(
        (c) => c.investors.reduce((acc, i) => acc + Number(i.amount), 0) > vms
      ).length + 1;

    res.json({ ...corp, vms, investorCount, accInvestRank, vmsRank });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/corporations/:id/investors", async (req, res) => {
  const numericId = Number(req.params.id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    return res.status(400).json({ message: "유효하지 않은 기업 ID입니다." });
  }

  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 5));

  try {
    const [investors, totalCount] = await prisma.$transaction([
      prisma.investor.findMany({
        where: { corpId: numericId },
        orderBy: { amount: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          amount: true,
          comment: true,
          corpId: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.investor.count({ where: { corpId: numericId } }),
    ]);

    res.status(200).json(buildPaginationResponse(investors, totalCount, req.query));
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
