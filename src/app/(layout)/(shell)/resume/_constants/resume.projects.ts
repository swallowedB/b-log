import type { ResumeProjectItem } from "./resume.types";

export const projectItems: readonly ResumeProjectItem[] = [
  {
    title: "RoomE",
    status: "paused",
    note: "몰입감 있는 3D 공간에서 나를 표현하고, 취향 기반으로 연결되는 힐링 커뮤니티 플랫폼",
    techStack: ["3D", "Community"],
    githubUrl: "https://github.com/swallowedB/roome",
  },
  {
    title: "MediaWave",
    status: "deployed",
    note: "지금 뜨는 영화와 시리즈를 한눈에 보고, 추천과 리뷰로 더 깊게 즐기는 커뮤니티",
    techStack: ["Movie", "Review"],
    githubUrl: "https://github.com/swallowedB/MediaWave",
    liveUrl: "https://mediawave-7cd4c.web.app/",
  },
  {
    title: "Comma",
    status: "deployed",
    note: "오락실 감성을 담은 미니게임과 커뮤니티로 잠깐의 쉼표를 제공하는 플랫폼",
    techStack: ["Mini Game", "Community"],
    githubUrl: "https://github.com/swallowedB/Comma",
    liveUrl: "https://comma-one.vercel.app/",
  },
  {
    title: "Plaist",
    status: "paused",
    note: "고민은 줄이고, 즐거움은 더하는 데이트 코스 플랫폼",
    techStack: ["Date Course", "Planning"],
    githubUrl: "https://github.com/swallowedB/Plaist",
  },
] as const;
