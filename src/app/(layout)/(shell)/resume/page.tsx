import ResumeGrid from "./_components/ResumeGrid";
import { getPublicCases, getPublicLearningEntries } from "@/lib/resume/content.server";
import { projectItems } from "./_constants/resume.projects";

export default function ResumePage() {
  const learning = getPublicLearningEntries().slice(0, 3).map(({ slug, title, summary, type, publishedAt, tags, coverImage }) => ({ slug, title, summary, type, publishedAt, tags, coverImage }));
  const cases = getPublicCases().map(({ slug, projectId, title, summary }) => ({
    slug,
    title,
    summary,
    projectName: projectItems.find((project) => project.id === projectId)?.title ?? projectId,
  }));
  return <ResumeGrid learning={learning} cases={cases} />;
}
