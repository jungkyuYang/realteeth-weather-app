export const TOGGLE_FAVORITE_CONSTANTS = {
  CONFIG: {
    MAX_COUNT: 6,
  },
  MESSAGES: {
    LIMIT_EXCEEDED: (max: number) => `최대 ${max}개까지만 등록 가능합니다.`,
    ADDED: '즐겨찾기에 추가되었습니다.',
    REMOVED: '즐겨찾기에서 제거되었습니다.',
  },
} as const;
