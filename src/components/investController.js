import express from "express";
import prisma from "../client.js";

const router = express.Router();

export const getSortedCorps = async (req, res) => {
  try {
    const sort = req.query.sort;
    const order = req.query.order;

    let page = req.query.page;
    if (!page) {
      page = 1;
    }
    page = Number(page);
    if (!Number.isInteger(page) || page < 1) {
      return res.status(400).json({ error: "INVALID_REQUEST: invalid page" });
    }

    const eachPage = 10;
    const corps = await prisma.corp.findMany();
    const investors = await prisma.investor.findMany();

    console.log(corps);
    const allGetData = corps.map(function (c) {
      const vmsAmount = investors
        .filter(function (i) {
          return i.corpId === c.id;
        })
        .reduce(function (acc, cur) {
          return acc + Number(cur.amount);
        }, 0);
      return { ...c, accInvest: Number(c.accInvest), vms: vmsAmount };
    });

    let sortData = sort ?? "vms";
    let orderData = order ?? "desc";

    if (sortData !== "vms" && sortData !== "accInvest") {
      sortData = "vms";
    }
    if (orderData !== "desc" && orderData !== "asc") {
      orderData = "desc";
    }

    const sortedData = [...allGetData].sort((a, b) => {
      if (sortData === "vms" && orderData === "desc") {
        return b.vms - a.vms;
      } else if (sortData === "vms" && orderData === "asc") {
        return a.vms - b.vms;
      } else if (sortData === "accInvest" && orderData === "desc") {
        return b.accInvest - a.accInvest;
      } else if (sortData === "accInvest" && orderData === "asc") {
        return a.accInvest - b.accInvest;
      } else {
        return b.vms - a.vms;
      }
    });

    const count = sortedData.length;

    const start = (page - 1) * eachPage;
    const end = page * eachPage;

    const pagination = sortedData.slice(start, end);

    res.status(200).json({
      success: true,
      data: pagination,
      totalCount: count,
      totalPages: Math.ceil(count / eachPage),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

router.get("/corporations/list", getSortedCorps);

export default router;
