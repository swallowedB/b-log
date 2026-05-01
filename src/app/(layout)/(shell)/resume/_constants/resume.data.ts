import type {
  ProfileLink,
  ResumeArchiveItem,
  ResumeChallengeItem,
  ResumeShelfItem,
  ResumeStat,
  ResumeTimelineItem,
} from "./resume.types";

export const profileHeroContent = {
  availabilityLabel: "working hard to grow",
  greetingPrefix: "Hello, I'm",
  name: "Boa",
  location: "Seoul, South Korea",
  email: "musamea99@gmail.com",
  intro:
    "흔들리고 어려운 순간에도 쉽게 포기하지 않고 끝까지 해결해내는 태도를 중요하게 생각합니다.",
  roles: ["Software Developer", "Archive Builder"],
  focusItems: ["AI", "Server", "Network"],
} as const;

export const statusSection = {
  title: "Status",
  scale: [
    {
      range: "0-20",
      label: "Basic Understanding",
      description: "기본 개념을 이해하고 따라갈 수 있는 단계",
    },
    {
      range: "21-40",
      label: "Assisted Execution",
      description: "익숙한 범위에서 가이드를 받아 수행하는 단계",
    },
    {
      range: "41-60",
      label: "Independent Execution",
      description: "일반적인 과업을 스스로 수행하는 단계",
    },
    {
      range: "61-80",
      label: "Practical Application",
      description: "실전 프로젝트에 안정적으로 적용하는 단계",
    },
    {
      range: "81-100",
      label: "Strategic Ownership",
      description: "복잡한 문제를 주도적으로 이끄는 단계",
    },
  ],
} as const;

export const stats: readonly ResumeStat[] = [
  {
    label: "Frontend Engineering",
    short: "FE",
    value: 94,
    note: "화면, 상태, 흐름을 안정적으로 구현하는 능력",
  },
  {
    label: "DevOps Basics",
    short: "DO",
    value: 37,
    note: "서비스를 배포하고 운영 흐름을 이해하는 능력",
  },
  {
    label: "Product / UX Sense",
    short: "UX",
    value: 90,
    note: "사용자가 더 자연스럽게 쓰도록 경험을 설계하는 감각",
  },
  {
    label: "Backend Fundamentals",
    short: "BE",
    value: 20,
    note: "서버와 데이터를 이해하고 기능 흐름을 설계하는 능력",
  },
  {
    label: "Problem Structuring",
    short: "PS",
    value: 86,
    note: "복잡한 문제를 구조화해 핵심 원인을 찾아내는 능력",
  },
  {
    label: "Communication",
    short: "CO",
    value: 81,
    note: "생각과 기술을 명확하게 설명하고 협업에 연결하는 능력",
  },
] as const;

export const experienceSection = {
  tabs: {
    experience: "Experience",
    education: "Education",
  },
} as const;

export const experienceItems: readonly ResumeTimelineItem[] = [
  {
    kind: "work",
    title: "Frontend Developer",
    company: "Saltlux",
    periodLocation: "2026 - Present | Jamsil, Seoul",
    techStack: ["React", "TypeScript", "Docker", "Nginx"],
    isCurrent: true,
  },
] as const;

export const educationItems: readonly ResumeTimelineItem[] = [
  {
    kind: "university",
    title: "Korea National Open University",
    meta: "2024-Present",
    gpa: "4.3 / 4.5",
    major: "Computer Science",
    isCurrent: true,
  },
  {
    kind: "program",
    title: "코드잇 프론트엔드 단기 심화 12기",
    organizer: "Codeit",
    meta: "2025.11 - 2026.01",
    techStack: ["CI/CD", "Docker" ,"Jest", "React-Library-test", "Next.js"],
  },
  {
    kind: "university",
    title: "Anyang University",
    meta: "2020-2025",
    major: "Global Business Administration",
    doubleMajor: "Digital Media Design",
    gpa: "4.12 / 4.5",
    isCurrent: false,
  },
  {
    kind: "program",
    title: "프로그래머스 데브코스 프론트엔드 2기",
    organizer: "(주)그렙",
    meta: "2024.10 - 2025.03",
    techStack: ["JavaScript", "TypeScript", "React", "Vue"],
  },
] as const;

export const cliSection = {
  title: "CLI",
  lines: [
    "$ boa cli --status",
    "> This terminal feature is planned for development.",
    "$ boa cli --preview",
    "> A small interactive resume command line will arrive later.",
    "$ echo 'coming soon'",
    "> Building quietly behind the scenes.",
  ],
  chips: ["about", "stack", "archive", "contact"],
  terminalPath: "boa@archive:~/chat",
  liveLabel: "live",
} as const;

export const shelfSection = {
  title: "Shelf",
  description: "최근 읽은 책, 시, 문장을 모으는 카드",
  quote: "“언젠가 다시 꺼내 보고 싶은 문장들을 모아두는 작은 저장소”",
  items: [
    {
      kind: "Book",
      title: "최근 읽은 책 제목",
      note: "짧은 감상이나 메모를 붙이는 자리",
    },
    {
      kind: "Poem",
      title: "기억하고 싶은 문장",
      note: "시, 문구, 메모, 대사처럼 다시 꺼내 볼 문장 저장소",
    },
  ] as const satisfies readonly ResumeShelfItem[],
} as const;

export const archiveSection = {
  title: "Archive",
  description: "사진이나 작업물 프리뷰를 놓는 자리",
  items: [
    {
      title: "Photo diary",
      note: "직접 찍은 사진 모음",
    },
    {
      title: "Work log",
      note: "UI 캡처와 작업 흔적",
    },
    {
      title: "Fragments",
      note: "짧은 실험 조각들",
    },
  ] as const satisfies readonly ResumeArchiveItem[],
} as const;

export const challengeSection = {
  title: "Challenge",
  description: "지금 하고 있는 루틴과 목표",
  items: [
    { title: "1 week 1 post", progress: "04 / 08", width: "50%" },
    { title: "photo archive sorting", progress: "38 / 100", width: "38%" },
    { title: "daily sentence collection", progress: "16 / 30", width: "53%" },
  ] as const satisfies readonly ResumeChallengeItem[],
} as const;

export const contactSection = {
  title: "Contact",
  description: "연락 방법과 짧은 인사말",
  heading: "같이 만들거나, 기록을 나누거나, 가볍게 인사해도 좋아요.",
  body: "지금은 기본 뼈대 단계라 문구와 링크는 샘플 위주로 두었습니다. 실제 이메일, 소개 문장, 채널 링크만 넣으면 바로 마무리할 수 있는 상태예요.",
  links: [
    { label: "Email", href: "mailto:musamea99@gmail.com" },
    { label: "GitHub", href: "https://github.com/swallowedB", external: true },
    { label: "Guestbook", href: "/guestbook" },
  ] as const satisfies readonly ProfileLink[],
} as const;
