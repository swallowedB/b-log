import { educationItems, experienceItems, profileHeroContent } from "@/app/(layout)/(shell)/resume/_constants/resume.data";
import { projectItems } from "@/app/(layout)/(shell)/resume/_constants/resume.projects";
import type { ResumeFAQ, ResumeSource } from "./types";

export function getProfileFAQs(): ResumeFAQ[] {
  const profile: ResumeSource = { id: "resume:profile", type: "resume", title: "프로필", url: "/resume#profile" };
  const experience: ResumeSource = { id: "resume:experience", type: "resume", title: "경력·교육", url: "/resume#experience" };
  const projects: ResumeSource = { id: "resume:projects", type: "resume", title: "프로젝트", url: "/resume#project" };
  const work = experienceItems.map((entry) => `${entry.company}의 ${entry.title} (${entry.periodLocation})`).join(", ");
  return [
    { id: "profile", question: "어떤 개발자인가요?", aliases: ["자기소개", "소개", "누구인가요"], answer: `${profileHeroContent.name}입니다. ${profileHeroContent.intro}`, sources: [profile] },
    { id: "experience", question: "현재 어떤 일을 하고 있나요?", aliases: ["현재 직장", "경력", "어디서 일하나요"], answer: `현재 이력서에는 ${work}로 기재되어 있습니다. 구체적인 업무 성과는 공개된 사례에서 확인할 수 있는 범위만 안내합니다.`, sources: [experience] },
    { id: "projects", question: "어떤 프로젝트를 만들었나요?", aliases: ["프로젝트 목록", "프로젝트 소개"], answer: projectItems.map((entry) => `${entry.title}: ${entry.note}`).join("\n"), sources: [projects] },
    { id: "learning-focus", question: "어떤 기술에 관심이 있나요?", aliases: ["관심 기술", "공부하는 기술"], answer: `현재 프로필의 관심 분야는 ${profileHeroContent.focusItems.join(", ")}입니다. 관심 분야를 실제 프로젝트 적용 성과로 단정하지는 않습니다.`, sources: [profile] },
    { id: "education", question: "어떤 교육을 받았나요?", aliases: ["학력", "교육 이력"], answer: educationItems.map((entry) => `${entry.title} (${entry.meta})`).join("\n"), sources: [experience] },
    { id: "contact", question: "어떻게 연락할 수 있나요?", aliases: ["연락처", "이메일"], answer: `프로필에 공개된 이메일은 ${profileHeroContent.email}입니다.`, sources: [profile] },
  ];
}
