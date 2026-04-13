import express from "express";
import prisma from "../client.js";
import {
  validateMySelectionRequest,
  validateComparisonSelectionsRequest,
} from "../utils/validation.js";

const router = express.Router();

//컨트롤러 함수들
export const getMySelection = async (req, res) => {
  try {
    const { userSessionId } = req.query; // snake_case → camelCase

    if (!userSessionId) {
      return res.status(400).json({
        success: false,
        error: "userSessionId는 필수 값입니다.", // 메시지도 수정
      });
    }

    const mySelection = await prisma.myselection.findFirst({
      where: { userSessionId }, // 그대로 사용
      include: { corp: true },
    });

    res.json({
      success: true,
      data: mySelection || null,
    });
  } catch (error) {
    console.error("내 기업 선택 조회 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    });
  }
};

// POST /api/my-selection
export const postMySelection = async (req, res) => {
  try {
    const validation = validateMySelectionRequest(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error,
      });
    }

    const { userSessionId, corpId } = req.body;

    if (!userSessionId || !corpId) {
      return res.status(400).json({
        success: false,
        error: "userSessionId와 corpId는 필수 값입니다.",
      });
    }

    // 기존 선택 삭제
    await prisma.myselection.deleteMany({
      where: { userSessionId },
    });

    // 새로운 선택 생성
    const mySelection = await prisma.myselection.create({
      data: {
        userSessionId,
        corpId: parseInt(corpId),
      },
      include: { corp: true },
    });

    res.json({
      success: true,
      data: mySelection,
    });
  } catch (error) {
    console.error("내 기업 선택 저장 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    });
  }
};

// GET /api/comparison-selections
export const getComparisonSelections = async (req, res) => {
  try {
    const { userSessionId } = req.query;

    if (!userSessionId) {
      return res.status(400).json({
        success: false,
        error: "userSessionId는 필수 값입니다.",
      });
    }

    const comparisonSelections = await prisma.comparisonselection.findMany({
      where: { userSessionId },
      include: { corp: true },
    });

    res.json({
      success: true,
      data: comparisonSelections || [],
    });
  } catch (error) {
    console.error("비교 기업 목록 조회 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    });
  }
};

// POST /api/comparison-selections
export const postComparisonSelections = async (req, res) => {
  try {
    const validation = validateComparisonSelectionsRequest(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error,
      });
    }

    const { userSessionId, corpIds } = req.body; // corpIds (camelCase)

    if (!userSessionId || !Array.isArray(corpIds)) {
      return res.status(400).json({
        success: false,
        error: "userSessionId와 corpIds는 필수 값입니다.",
      });
    }

    if (corpIds.length < 1 || corpIds.length > 5) {
      return res.status(400).json({
        success: false,
        error: "비교 기업은 최소 1개, 최대 5개까지 선택 가능합니다.",
      });
    }

    // 기존 선택 삭제
    await prisma.comparisonselection.deleteMany({
      where: { userSessionId },
    });

    // 새로운 선택들 생성
    const comparisonSelections = await Promise.all(
      corpIds.map((corpId) =>
        prisma.comparisonselection.create({
          data: {
            userSessionId,
            corpId,
          },
          include: { corp: true },
        }),
      ),
    );

    res.json({
      success: true,
      data: comparisonSelections,
    });
  } catch (error) {
    console.error("비교 기업 저장 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    });
  }
};

//라우트 정의
router.get("/my-selection", getMySelection);
router.post("/my-selection", postMySelection);
router.get("/comparison-selections", getComparisonSelections);
router.post("/comparison-selections", postComparisonSelections);

export default router;
