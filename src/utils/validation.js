// 입력 검증 유틸리티

// 1. userSessionId 검증 - 필수값, 문자열, 빈값여부
export const validateUserSessionId = (userSessionId) => {
  if (!userSessionId) {
    return {
      valid: false,
      error: "userSessionId는 필수 값입니다.",
    };
  }

  if (typeof userSessionId !== "string") {
    return {
      valid: false,
      error: "userSessionId는 문자열이어야 합니다.",
    };
  }

  if (userSessionId.trim().length === 0) {
    return {
      valid: false,
      error: "userSessionId는 빈 값일 수 없습니다.",
    };
  }

  return { valid: true };
};

// 2. corpId 검증 (단일) - 필수값, 숫자, 양수
export const validateCorpId = (corpId) => {
  if (corpId === undefined || corpId === null) {
    return {
      valid: false,
      error: "corpId는 필수 값입니다.",
    };
  }

  const parsedId = parseInt(corpId, 10);

  if (isNaN(parsedId)) {
    return {
      valid: false,
      error: "corpId는 숫자여야 합니다.",
    };
  }

  if (parsedId <= 0) {
    return {
      valid: false,
      error: "corpId는 1 이상의 양수여야 합니다.",
    };
  }

  return { valid: true, value: parsedId };
};

// 3. corpIds 검증 (배열) - 필수값, 배열, 최소/최대 길이, 요소 검증
export const validateCorpIds = (corpIds) => {
  if (!Array.isArray(corpIds)) {
    return {
      valid: false,
      error: "corpIds는 배열이어야 합니다.",
    };
  }

  if (corpIds.length < 1) {
    return {
      valid: false,
      error: "비교 기업은 최소 1개 이상 선택해야 합니다.",
    };
  }

  if (corpIds.length > 5) {
    return {
      valid: false,
      error: "비교 기업은 최대 5개까지만 선택 가능합니다.",
    };
  }

  // 배열의 모든 요소가 유효한 숫자인지 확인
  const validatedIds = corpIds.map((id) => {
    const parsed = parseInt(id, 10);
    if (isNaN(parsed) || parsed <= 0) {
      return null;
    }
    return parsed;
  });

  if (validatedIds.includes(null)) {
    return {
      valid: false,
      error: "corpIds의 모든 요소는 1 이상의 양수여야 합니다.",
    };
  }

  return { valid: true, value: validatedIds };
};

// 4. POST /api/my-selection 요청 검증 - userSessionId, corpId 검증
export const validateMySelectionRequest = (body) => {
  const { userSessionId, corpId } = body;

  // userSessionId 검증
  const sessionValidation = validateUserSessionId(userSessionId);
  if (!sessionValidation.valid) {
    return sessionValidation;
  }

  // corpId 검증
  const corpIdValidation = validateCorpId(corpId);
  if (!corpIdValidation.valid) {
    return corpIdValidation;
  }

  return {
    valid: true,
    data: {
      userSessionId,
      corpId: corpIdValidation.value,
    },
  };
};

// 5. POST /api/comparison-selections 요청 검증
export const validateComparisonSelectionsRequest = (body) => {
  const { userSessionId, corpIds } = body;

  // userSessionId 검증
  const sessionValidation = validateUserSessionId(userSessionId);
  if (!sessionValidation.valid) {
    return sessionValidation;
  }

  // corpIds 검증
  const corpIdsValidation = validateCorpIds(corpIds);
  if (!corpIdsValidation.valid) {
    return corpIdsValidation;
  }

  return {
    valid: true,
    data: {
      userSessionId,
      corpIds: corpIdsValidation.value,
    },
  };
};
