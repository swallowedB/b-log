export type ProfileLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type ResumeStat = {
  label: string;
  short: string;
  value: number;
  note: string;
};

export type ResumeTimelineItem = {
  kind?: "work" | "university" | "program";
  title: string;
  meta?: string;
  degree?: string;
  major?: string;
  doubleMajor?: string;
  gpa?: string;
  description?: string;
  descriptionItems?: readonly string[];
  company?: string;
  organizer?: string;
  periodLocation?: string;
  techStack?: readonly string[];
  isCurrent?: boolean;
};

export type ResumeProjectItem = {
  title: string;
  status: "deployed" | "paused";
  note: string;
  techStack: readonly string[];
  githubUrl: string;
  liveUrl?: string;
};

export type ResumeShelfItem = {
  kind: string;
  title: string;
  note: string;
};

export type ResumeArchiveItem = {
  title: string;
  note: string;
};

export type ResumeChallengeItem = {
  title: string;
  progress: string;
  width: string;
};
