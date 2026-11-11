export type ResumeSource = {
  id: string;
  type: "resume" | "case" | "project" | "post" | "learning";
  title: string;
  url: string;
};

export type ResumeFAQ = {
  id: string;
  question: string;
  aliases: string[];
  answer: string;
  sources: ResumeSource[];
};

export type StaticAnswer = Pick<ResumeFAQ, "answer" | "sources">;

export type ContextDocument = {
  id: string;
  title: string;
  text: string;
  tags: string[];
  keywords: string[];
  sourceIds: string[];
};

export type CaseFile = {
  slug: string;
  projectId: string;
  title: string;
  summary: string;
  tags: string[];
  keywords: string[];
  publishedAt: string;
  published: boolean;
  featured: boolean;
  relatedPostSlugs: string[];
  relatedLearningSlugs: string[];
  evidenceLinks: { title: string; url: string }[];
  chat?: { question: string; aliases: string[]; answer: string };
  raw: string;
  contextText: string;
  code: string;
};
