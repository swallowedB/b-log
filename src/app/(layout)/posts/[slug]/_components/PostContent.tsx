import { MDXContent } from "@/components/MDXContent";

export default function PostContent({ content }: { content: string }) {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none mt-5">
      <MDXContent content={content} />
    </article>
  );
}
