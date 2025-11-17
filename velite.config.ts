import { defineCollection, defineConfig, s } from "velite";

const posts = defineCollection({
  name: "posts",
  pattern: "posts/**/*.mdx",
  schema: s.object({
    title: s.string(),
    date: s.string(),
    tags: s.array(s.string()).default([]),
    summary: s.string().optional(),
    cover: s.string().optional(),
    draft: s.boolean().default(false),
    category: s.enum(["DEV_LOG", "INSIGHT", "JOURNAL"]),
    series: s.string().optional(),  
    slug: s.string(),
  }),
});

export default defineConfig({
  output: {
    data: ".velite",          
    assets: "public/static", 
    base: "/static/",         
  },
  collections: { posts },
});
