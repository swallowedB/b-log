import RecommendedPostCard, {
  RecommendedPost,
} from "@/app/(layout)/posts/[slug]/_components/post-recommended/RecommendedPostCard";

export default function RecommendedPosts() {
  const items: RecommendedPost[] = [
    {
      title: "React 상태 관리, 왜 어려울까?",
      overview:
        "state, props, context가 섞일 때 복잡도가 급증하는 이유와 단순화 전략을 정리합니다.",
      href: "#",
    },
    {
      title: "useEffect를 덜 쓰는 패턴",
      overview:
        "불필요한 effect를 줄이고 서버/쿼리/파생 상태로 대체하는 실전 패턴을 소개합니다.",
      href: "#",
    },
    {
      title: "컴포넌트 분해 기준 5가지",
      overview:
        "재사용성과 응집도를 동시에 챙기는 컴포넌트 분해 체크리스트를 제공합니다.",
      href: "#",
    },
  ];

  return (
    <section className="space-y-3">
      <h2 className="mb-1.5 pl-1 text-sm font-semibold text-foreground/60 dark:text-neutral-100">
        추천 포스트
      </h2>

      <div className="space-y-3">
        {items.map((post) => (
          <RecommendedPostCard key={post.title} post={post} />
        ))}
      </div>
    </section>
  );
}
