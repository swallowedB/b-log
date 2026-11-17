import ResumeGrid from "./_components/ResumeGrid";
import { getPublicLearningEntries } from "@/lib/resume/content.server";

export default function ResumePage() {
  const learning = getPublicLearningEntries().slice(0, 3).map(({ slug, title, summary, type, publishedAt, tags, coverImage }) => ({ slug, title, summary, type, publishedAt, tags, coverImage }));
  return <ResumeGrid learning={learning} />;
}
