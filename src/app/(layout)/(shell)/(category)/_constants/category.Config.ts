export const CATEGORY_CONFIG = {
  "dev-log": {
    slug: "dev-log",
    label: "Dev_log",
    title: "Dev-log",
    description:
      "실험과 구현 과정의 기록. 실패와 해결을 그대로 남겨두는 개발 기록",
  },
  insight: {
    slug: "insight",
    label: "Insight",
    title: "Insight",
    description: "기술 개념과 인사이트를 정리해 쌓아가는 아카이브",
  },
  journal: {
    slug: "journal",
    label: "Journal",
    title: "Journal",
    description: "지나온 경험을 정리하고 다음 방향을 고민하는 개인 저널",
  },
} as const;

export type CategoryId = keyof typeof CATEGORY_CONFIG;
