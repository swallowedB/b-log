import { CategoryKey } from "@/config/categories";
import type { SeriesMeta } from "./series.types";

export const SERIES_META_BY_CATEGORY: Record<CategoryKey, SeriesMeta[]> = {
  Dev_log: [
    {
      id: "plaist",
      name: "Plaist",
      description:
        "고민은 줄이고, 즐거움은 더하는 데이트 코스 추천 플랫폼의 개발 기록",
      category: "Dev_log",
      tone: "purple",
    },
    {
      id: "comma",
      name: "Comma",
      description:
        "오락실 감성을 담은 미니게임과 커뮤니티로 ‘잠깐의 쉼표’를 제공하는 플랫폼",
      category: "Dev_log",
      tone: "blue",
    },
    {
      id: "roome",
      name: "RoomE",
      description:
        "3D 공간에서 취향으로 연결되는 힐링 커뮤니티 RoomE의 개발 기록",
      category: "Dev_log",
      tone: "blue",
    },
    {
      id: "b-log",
      name: "B-log",
      description:
        "개인 기술 블로그를 설계하고 구현해 나가는 과정을 기록한 개발 기록",
      category: "Dev_log",
      tone: "pink",
    },
  ],

  Insight: [
    {
      id: "react",
      name: "React",
      description:
        "React를 사용하며 마주한 개념, 패턴, 설계 고민을 정리한 인사이트 기록",
      category: "Insight",
      tone: "blue",
    },
    {
      id: "nextjs",
      name: "Next.js",
      description:
        "Next.js 기반 애플리케이션 구조, 렌더링 방식, 데이터 흐름을 고민하며 정리한 인사이트 모음",
      category: "Insight",
      tone: "darkblue",
    },
    {
      id: "r3f-issues",
      name: "R3F Issues",
      description:
        "react-three-fiber의 GitHub 이슈를 하나씩 읽으며 설계 결정과 기술적 맥락을 정리한 기록",
      category: "Insight",
      tone: "gray",
    },
    {
      id: "docker",
      name: "Docker",
      description:
        "코드가 실행되기까지, Docker가 감싸고 있는 환경의 구조를 파고든 기록",
      category: "Insight",
      tone: "blue",
    },
    {
      id: "3d",
      name: "3D",
      description:
        "3D 그래픽스의 원리, 렌더링 구조, 인터랙션과 성능을 폭넓게 탐구하며 정리한 인사이트 기록",
      category: "Insight",
      tone: "purple",
    },
    {
      id: "testing",
      name: "Test",
      description:
        "테스트를 통해 코드의 신뢰성과 설계를 개선해 나가는 과정에서 얻은 인사이트 기록",
      category: "Insight",
      tone: "orange",
    },
    {
      id: "git/github",
      name: "Git/Github",
      description:
        "Git/GitHub의 동작 원리를 학습하고, 협업 환경에서의 충돌·이력 관리 문제를 해결하며 쌓은 인사이트 기록",
      category: "Insight",
      tone: "gray",
    },
  ],

  Journal: [
    {
      id: "annual-journal",
      name: "연간 리캡",
      description: "한 해를 돌아보며 기록하는 연간 회고 시리즈",
      category: "Journal",
      tone: "purple",
    },
  ],
};
