export const post = {
    title: "리액트 시작하기: 개념 잡기 할 줄 알았지만 아니지롱 메롱메롱 메롱",
    date: "2025-01-10",
    category: "Dev_log",
    series: "React-Basics",
    summary: "리액트 기본 개념을 빠르게 훑어보는 입문 가이드입니다.",
    cover: "",
    tags: ["React", "Javascript", "Frontend"],
  };
export type TocItem = { id: string; text: string; level: 2 | 3 };

export  const toc: TocItem[] = [
    { id: "what-is-react", text: "React란 무엇인가?", level: 2 },
    { id: "what-is-component", text: "컴포넌트란?", level: 2 },
    { id: "props-state", text: "Props와 State", level: 2 },
    { id: "rendering", text: "렌더링 흐름", level: 2 },
  ];