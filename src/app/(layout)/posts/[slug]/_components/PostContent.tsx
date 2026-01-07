import { MDXComponents, MDXContent } from "@/components/MDXContent";
import * as mdxComponents from "@/components/mdx";


export default function PostContent({ content }: { content: string }) {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none mt-5">
      <MDXContent
        content={content}
        components={mdxComponents as unknown as MDXComponents}
      />
    </article>
  );
}
