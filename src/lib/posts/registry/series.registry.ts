import type { SeriesMeta } from "./series.types";

export const SERIES_META_BY_CATEGORY: Record<
  "Dev_log" | "Insight" | "Journal",
  SeriesMeta[]
> = {
  Dev_log: [
    {
      id: "roome-series",
      name: "RoomE",
      description:
        "3D 룸 투어 서비스 RoomE를 설계부터 배포까지 구현한 과정을 기록한 시리즈입니다.",
      category: "Dev_log",
      tone: "blue",
    },
    {
      id: "slice-series",
      name: "Slice",
      description:
        "팀 기반 목표/할 일 관리 서비스 Slice를 설계하고 구현하며 겪은 기술적 의사결정을 정리한 시리즈입니다.",
      category: "Dev_log",
      tone: "green",
    },
    {
      id: "blog-refactor",
      name: "B-log Refactor",
      description:
        "개인 기술 블로그를 App Router, RSC, Velite 기반으로 리팩토링한 과정과 고민을 담은 시리즈입니다.",
      category: "Dev_log",
      tone: "orange",
    },
  ],

  Insight: [],

  Journal: [],
};
