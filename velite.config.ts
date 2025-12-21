import { defineConfig, defineCollection, s } from "velite";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";

const capitalizeFirst = (v: string) => {
  const t = v.trim();
  if (!t) return t;
  return t[0].toUpperCase() + t.slice(1);
};

const normalizeTags = (arr: string[]) =>
  Array.from(new Set(arr.map((t) => capitalizeFirst(t)).filter(Boolean)));

const ymd = s
  .isodate()
  .transform((iso) => iso.slice(0, 10))
  .refine((d) => /^\d{4}-\d{2}-\d{2}$/.test(d), {
    message: 'date must be "YYYY-MM-DD"',
  });

const Category = s.enum(["Dev_log", "Insight", "Journal"]);

export default defineConfig({
  collections: {
    posts: defineCollection({
      name: "posts",
      pattern: "posts/**/*.mdx",
      schema: s.object({
        title: s.string().min(1),
        slug: s.slug(), 
        date: ymd,
        category: Category,

        series: s
          .string()
          .optional()
          .transform((v) => (v ? capitalizeFirst(v) : undefined)),

        tags: s
          .array(s.string())
          .default([])
          .transform(normalizeTags),

        summary: s.string().optional(),
        thumbnail: s.string().min(1),
        draft: s.boolean().default(false),

        content: s.mdx(),
        toc: s.toc(),
      }),
    }),
  },
  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          keepBackground: false, 
          theme: {
            dark: "github-dark",
            light: "github-light",
          },
          defaultLang: "txt",
        },
      ],
    ],
  },
});
