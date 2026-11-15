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

export type LearningType = "book" | "conference" | "course";
export type LearningEntry = {
  slug: string;
  title: string;
  type: LearningType;
  publishedAt: string;
  consumedAt?: string;
  summary: string;
  tags: string[];
  coverImage?: string;
  publisherOrOrganizer?: string;
  originalUrl?: string;
  relatedPostSlugs: string[];
  appliedTo: {
    status: "applied" | "planned" | "not_applied";
    description: string;
    relatedCaseIds: string[];
    relatedProjectIds: string[];
    evidenceLinks: { title: string; url: string }[];
  };
  published: boolean;
  raw: string;
  contextText: string;
  code: string;
};
