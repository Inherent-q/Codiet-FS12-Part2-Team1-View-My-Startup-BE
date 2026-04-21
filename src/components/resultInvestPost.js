import express from "express";
import prisma from "../client.js";

const router = express.Router();

export const postInvestor = async (req, res) => {
  try {
    const { name, amount, password, comment, corpId, updatedAt } = req.body;
    const addInvestors = await prisma.investor.create({
      data: {
        name,
        amount,
        password,
        comment,
        corpId,
        updatedAt,
      },
    });
    res.status(201).json(addInvestors);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

router.post("/investors", postInvestor);

export default router;
