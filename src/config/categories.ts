export type CategoryKey = "Dev_log" | "Insight" | "Journal";

export const CATEGORY_CONFIG = {
  "dev-log": {
    id: "dev-log",
    slug: "dev-log",
    key: "Dev_log",
    title: "Dev-log",
    description: "실험과 구현 과정의 기록. 실패와 해결을 그대로 남겨두는 개발 기록",
  },
  insight: {
    id: "insight",
    slug: "insight",
    key: "Insight",
    title: "Insight",
    description: "기술 개념과 인사이트를 정리해 쌓아가는 아카이브",
  },
  journal: {
    id: "journal",
    slug: "journal",
    key: "Journal",
    title: "Journal",
    description: "지나온 경험을 정리하고 다음 방향을 고민하는 개인 저널",
  },
} as const;

export type CategorySlug = keyof typeof CATEGORY_CONFIG;
export type CategoryConfig = (typeof CATEGORY_CONFIG)[CategorySlug];
