import ResumeGrid from "./_components/ResumeGrid";
import { getPublicFAQs } from "@/lib/resume/content.server";

export default function ResumePage() {
  return <ResumeGrid faqs={getPublicFAQs()} />;
}
