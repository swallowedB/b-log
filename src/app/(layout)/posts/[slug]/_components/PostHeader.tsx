import { ChevronRight } from "lucide-react";

type PostHeaderProps = {
  post: {
    title: string;
    date: string;
    category: string;
    series?: string;
    summary?: string;
    cover?: string;
  };
};

export default function PostHeader({ post }: PostHeaderProps) {
  return (
    <header className="flex flex-col gap-3">
      <section className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-1 text-xs text-foreground/70 ">
          <span>{post.category}</span>
          {post.series ? (
            <>
              <ChevronRight className="w-3 text-foreground/30" />
              <span>{post.series}</span>
            </>
          ) : null}
        </div>

        <h1 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
          {post.title}
        </h1>
      </section>
      <span className="text-foreground/30 text-xs">{post.date}</span>
    </header>
  );
}
