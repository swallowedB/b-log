import { PostCardProps } from "@/app/(layout)/(shell)/_components/posts/PostCard";

export const MOCK_POSTS: PostCardProps[] = [
  {
    href: "/posts/room-e-3d-journey",
    thumbnailSrc: "/sample.png",
    thumbnailAlt: "3D RoomE 프로젝트 화면",
    category: "Project",
    date: "2025.12.10",
    title: "RoomE: 3D 공간에서 시작한 인터랙션 실험",
    excerpt:
      "React-Three-Fiber로 구현한 3D 공간 기반 사이드 프로젝트 RoomE. 초기 컨셉부터 실제 구현까지의 과정과 시행착오를 정리했습니다.",
  },
  {
    href: "/posts/slice-sprint-architecture",
    thumbnailSrc: "/sample.png",
    thumbnailAlt: "Slice 앱 아키텍처 다이어그램",
    category: "Sprint",
    date: "2025.12.08",
    title: "Slice 스프린트: Next.js 15와 TanStack Query 아키텍처 정리",
    excerpt:
      "인증, 토큰 전략, 폴더 구조, 테스트 전략까지 Slice 프로젝트에서 사용한 아키텍처 설계 의도와 트레이드오프를 공유합니다.",
  },
  {
    href: "/posts/blog-design-aurora",
    thumbnailSrc: "/sample.png",
    thumbnailAlt: "Aurora 배경이 적용된 블로그 메인 화면",
    category: "Design",
    date: "2025.12.05",
    title: "Aurora 배경과 글래스모피즘으로 만든 B-log 메인 설계",
    excerpt:
      "배경, 타이포그래피, 컬러 토큰, 다크 모드까지 포함한 B-log의 전체 디자인 시스템을 정리했습니다.",
  },
  {
    href: "/posts/testing-strategy-b-log",
    thumbnailSrc: "/sample.png",
    thumbnailAlt: "테스트 코드와 커버리지 리포트",
    category: "Testing",
    date: "2025.12.03",
    title: "개인 블로그에도 테스트를? B-log 테스트 전략 회고",
    excerpt:
      "Next.js 기반 개인 블로그에 어디까지 테스트를 가져갈지, 어떤 부분을 우선순위로 잡았는지에 대한 고민을 정리했습니다.",
  },
  {
    href: "/posts/zustand-auth-pattern",
    thumbnailSrc: "/sample.png",
    thumbnailAlt: "Zustand로 관리하는 인증 상태",
    category: "Frontend",
    date: "2025.12.01",
    title: "Zustand + TanStack Query 조합으로 인증 상태 관리하기",
    excerpt:
      "전역 상태와 서버 상태를 분리하면서도 로그인/로그아웃 UX를 깔끔하게 유지한 패턴을 정리했습니다.",
  },
  {
    href: "/posts/token-refresh-flow",
    thumbnailSrc: "/sample.png",
    thumbnailAlt: "토큰 재발급 플로우 순서도",
    category: "Frontend",
    date: "2025.11.28",
    title: "Access / Refresh 토큰 재발급 플로우 정리",
    excerpt:
      "401 처리, 인터셉터, 재요청 전략까지 포함한 실제 토큰 재발급 구현 과정을 다룹니다.",
  },
  {
    href: "/posts/next-routing-notes",
    thumbnailSrc: "/sample.png",
    thumbnailAlt: "Next.js 라우팅 구조",
    category: "Note",
    date: "2025.11.25",
    title: "Next.js App Router 라우팅 패턴 메모",
    excerpt:
      "동적 라우트, 병렬/인터셉트 라우트, 그룹 라우트까지 App Router에서 자주 쓰게 되는 패턴들을 정리했습니다.",
  },
  {
    href: "/posts/computer-architecture-log",
    thumbnailSrc: "/sample.png",
    thumbnailAlt: "컴퓨터 구조 노트",
    category: "Study",
    date: "2025.11.20",
    title: "컴퓨터 구조 공부 로그: 주소 지정과 명령어 형식",
    excerpt:
      "시험 준비하면서 헷갈렸던 주소 지정 방식, 제어 단어, 마이크로프로그램 개념을 블로그용으로 다시 정리했습니다.",
  },

  // ------ 추가 목데이터 (페이지 여러 개 나오도록) ------

  {
    href: "/posts/til-2025-11-frontend-notes",
    thumbnailSrc: "/sample.png",
    thumbnailAlt: "프론트엔드 TIL 노트",
    category: "Note",
    date: "2025.11.18",
    title: "TIL: React 성능 최적화 메모",
    excerpt:
      "렌더링 최소화, memoization, Suspense 활용까지 실제 프로젝트에서 사용한 성능 최적화 팁을 정리했습니다.",
  },
  {
    href: "/posts/til-2025-11-testing-notes",
    thumbnailSrc: "/sample.png",
    thumbnailAlt: "테스트 코드 노트",
    category: "Testing",
    date: "2025.11.16",
    title: "TIL: Jest + RTL로 컴포넌트 테스트하기",
    excerpt:
      "렌더링 헬퍼, 쿼리 사용 패턴, 비동기 처리 테스트까지 기본 패턴을 정리한 기록입니다.",
  },
  {
    href: "/posts/til-2025-11-git-workflow",
    thumbnailSrc: "/sample.png",
    thumbnailAlt: "Git 브랜치 전략",
    category: "Note",
    date: "2025.11.14",
    title: "Git 브랜치 전략과 PR 템플릿 회고",
    excerpt:
      "feature / fix / chore 브랜치 전략과 PR 템플릿, 커밋 컨벤션을 실제 스프린트에 적용하면서 느낀 점들을 정리했습니다.",
  },
  {
    href: "/posts/til-2025-11-next-hydration",
    thumbnailSrc: "/sample.png",
    thumbnailAlt: "Next.js 하이드레이션",
    category: "Frontend",
    date: "2025.11.12",
    title: "Next.js Hydration mismatch 디버깅 기록",
    excerpt:
      "useMediaQuery, 클라이언트 전용 훅, 조건부 렌더링으로 하이드레이션 이슈를 해결한 과정을 정리했습니다.",
  },
  {
    href: "/posts/til-2025-11-tailwind-theme",
    thumbnailSrc: "/sample.png",
    thumbnailAlt: "Tailwind 테마 토큰",
    category: "Design",
    date: "2025.11.10",
    title: "Tailwind v4 @theme로 토큰 관리하기",
    excerpt:
      "컬러, 폰트, spacing 토큰을 @theme로 관리하면서 다크 모드까지 자연스럽게 연결한 설정 방법입니다.",
  },
  {
    href: "/posts/til-2025-11-storybook-setup",
    thumbnailSrc: "/sample.png",
    thumbnailAlt: "Storybook 설정 화면",
    category: "Frontend",
    date: "2025.11.08",
    title: "Storybook 환경 구성과 UI 컴포넌트 분리",
    excerpt:
      "공통 버튼, 태그, 카드 컴포넌트를 Storybook에서 관리하면서 얻은 장단점을 기록했습니다.",
  },
  {
    href: "/posts/til-2025-11-zustand-patterns",
    thumbnailSrc: "/sample.png",
    thumbnailAlt: "Zustand 상태 관리",
    category: "Frontend",
    date: "2025.11.06",
    title: "Zustand 상태 관리 패턴 모음",
    excerpt:
      "persist 미들웨어, partialize, onRehydrateStorage 등 Slice 프로젝트에서 사용한 패턴을 정리했습니다.",
  },
  {
    href: "/posts/til-2025-11-accessibility",
    thumbnailSrc: "/sample.png",
    thumbnailAlt: "웹 접근성 체크",
    category: "Frontend",
    date: "2025.11.04",
    title: "웹 접근성 체크리스트 첫 정리",
    excerpt:
      "키보드 포커스, aria-label, 시맨틱 태그 사용 등 기본적인 접근성 체크리스트를 정리했습니다.",
  },
  {
    href: "/posts/til-2025-10-sql-study",
    thumbnailSrc: "/sample.png",
    thumbnailAlt: "SQL 공부 노트",
    category: "Study",
    date: "2025.10.30",
    title: "정보처리기사 대비 SQL 정리 노트",
    excerpt:
      "JOIN, GROUP BY, 서브쿼리, EXISTS 등 자주 헷갈리는 SQL 문법을 문제 풀이 중심으로 재정리했습니다.",
  },
  {
    href: "/posts/til-2025-10-os-scheduling",
    thumbnailSrc: "/sample.png",
    thumbnailAlt: "운영체제 스케줄링",
    category: "Study",
    date: "2025.10.28",
    title: "운영체제 스케줄링 알고리즘 비교",
    excerpt:
      "선점/비선점, FCFS, SJF, 라운드 로빈 등 각 스케줄링 기법의 특징과 장단점을 표로 정리했습니다.",
  },
  {
    href: "/posts/til-2025-10-computer-architecture",
    thumbnailSrc: "/sample.png",
    thumbnailAlt: "컴퓨터 구조 다이어그램",
    category: "Study",
    date: "2025.10.26",
    title: "제어 단어와 마이크로프로그램 정리",
    excerpt:
      "제어 저장장치, 마이크로명령 형식, ROM 용량 계산 문제를 다시 풀어보며 개념을 다졌습니다.",
  },
  {
    href: "/posts/til-2025-10-patterns-design-system",
    thumbnailSrc: "/sample.png",
    thumbnailAlt: "디자인 시스템 토큰",
    category: "Design",
    date: "2025.10.24",
    title: "B-log 디자인 시스템 초안 정리",
    excerpt:
      "타이포 스케일, 컬러 팔레트, 카드/버튼 컴포넌트 스타일을 정리한 첫 번째 버전 기록입니다.",
  },
  {
    href: "/posts/til-2025-10-slice-retrospective-1",
    thumbnailSrc: "/sample.png",
    thumbnailAlt: "Slice 회고",
    category: "Retrospective",
    date: "2025.10.22",
    title: "Slice 스프린트 1차 회고: 협업과 코드 리뷰",
    excerpt:
      "PR 템플릿, 리뷰 방식, 브랜치 전략이 실제 협업에 어떤 영향을 주었는지 돌아본 회고입니다.",
  },
  {
    href: "/posts/til-2025-10-slice-retrospective-2",
    thumbnailSrc: "/sample.png",
    thumbnailAlt: "Slice 2차 회고",
    category: "Retrospective",
    date: "2025.10.20",
    title: "Slice 스프린트 2차 회고: UI/UX와 퍼포먼스",
    excerpt:
      "리스트 렌더링 최적화, skeleton 화면, 반응형 그리드 구현 과정에서의 시행착오를 정리했습니다.",
  },
  {
    href: "/posts/til-2025-10-life-balance",
    thumbnailSrc: "/sample.png",
    thumbnailAlt: "공부와 휴식의 균형",
    category: "Life",
    date: "2025.10.18",
    title: "코딩, 공부, 휴식 밸런스를 찾는 중",
    excerpt:
      "스프린트, 학교 공부, 자격증 준비를 병행하면서 느낀 체력/멘탈 관리 방법을 적어보았습니다.",
  },
];
