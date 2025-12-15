import PostCard from "@/components/post-card/PostCard";
import sample from "@/assets/sample.png";
import Hero from "./_components/home/Hero";

export default function HomePage() {
  return (
    <main className="px-25">
      <Hero />
      <PostCard
        href="/posts/web-accessibility-aria-metadata"
        thumbnailSrc={sample}
        thumbnailAlt="웹 접근성 아티클 썸네일"
        category="DEV_LOG"
        date="2025.11.10"
        title="웹 접근성 : ARIA, 메타데이터"
        excerpt="시각적 아름다움만큼 중요한 것은 ‘누구나 접근할 수 있는 경험’입니다. ARIA 속성과 키보드 내비게이션을…"
      />
    </main>
  );
}
