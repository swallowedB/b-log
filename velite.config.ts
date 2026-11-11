import tailwindDarkest from "@/styles/shiki/tailwind-darkest.json";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkLinkCard from "remark-link-card-plus";
import { defineCollection, defineConfig, s } from "velite";
import { validateCases } from "./src/lib/resume/catalog";
import { projectItems } from "./src/app/(layout)/(shell)/resume/_constants/resume.projects";

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
    cases: defineCollection({
      name: "CaseFile",
      pattern: "resume/cases/**/*.mdx",
      schema: s.object({
        slug: s.slug("cases"),
        projectId: s.string().min(1),
        title: s.string().min(1),
        summary: s.string().min(1),
        tags: s.array(s.string()).default([]),
        keywords: s.array(s.string()).default([]),
        publishedAt: ymd,
        published: s.boolean().default(false),
        featured: s.boolean().default(false),
        relatedPostSlugs: s.array(s.string()).default([]),
        relatedLearningSlugs: s.array(s.string()).default([]),
        evidenceLinks: s.array(s.object({ title: s.string().min(1), url: s.string().url() })).default([]),
        chat: s.object({ question: s.string().min(1), aliases: s.array(s.string()).default([]), answer: s.string().min(1) }).optional(),
        code: s.mdx(),
        raw: s.raw(),
        contextText: s.excerpt({ length: 6000 }),
      }),
    }),
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
  prepare: ({ cases, posts }) => validateCases({ cases, posts, projects: projectItems }),
  mdx: {
    remarkPlugins: [
      remarkGfm,
      [
        remarkLinkCard,
        {
          className: "link-card",
        },
      ],
    ],
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
