export default function PostContent() {
  return (
    <article className="prose prose-neutral max-w-none mt-5">
      <h2 id="what-is-react">React란 무엇인가?</h2>
      <p>
        리액트는 UI를 만들기 위한 자바스크립트 라이브러리입니다. 컴포넌트를
        기반으로 UI를 구성하고 상태 변화를 UI에 반영합니다.
      </p>

      <h2 id="what-is-component">컴포넌트란?</h2>
      <p>
        UI를 쪼개서 재사용 가능한 단위로 만드는 것을 의미합니다. 유지보수성과
        확장성을 높입니다.
      </p>

      <h2 id="props-state">Props와 State</h2>
      <p>부모→자식 데이터 전달(props)과 컴포넌트 내부 상태(state)의 차이를 다룹니다.</p>

      <h2 id="rendering">렌더링 흐름</h2>
      <p>상태 변경 → 재렌더 → DOM 반영의 흐름을 간단히 정리합니다.</p>
    </article>
  );
}
