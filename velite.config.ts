import tailwindDarkest from "@/styles/shiki/tailwind-darkest.json";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { defineCollection, defineConfig, s } from "velite";

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
          .transform((v) => (v ? v.trim() : undefined)),

        tags: s.array(s.string()).default([]).transform(normalizeTags),

        summary: s.string().optional(),
        thumbnail: s
          .string()
          .optional()
          .transform((v) => {
            if (!v || v.trim().length === 0) return undefined;
            return v;
          }),
        draft: s.boolean().default(false),

        code: s.mdx(),
        toc: s.toc(),
      }),
    }),
  },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: {
            className: ["heading-anchor"],
          },
        },
      ],
      [
        rehypePrettyCode,
        {
          keepBackground: false,
          theme: {
            dark: tailwindDarkest,
            light: "github-light",
          },
          defaultLang: "txt",
        },
      ],
    ],
  },
});
