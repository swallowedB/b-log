import Link from "next/link";
import type { LearningType } from "@/lib/resume/types";

export default function LearningFilters({ type }: { type?: LearningType }) {
  const filters = [{ label: "All", value: undefined }, { label: "Books", value: "book" }, { label: "Conferences", value: "conference" }, { label: "Courses", value: "course" }] as const;
  return <nav aria-label="학습 유형" className="my-8 flex flex-wrap gap-2">{filters.map((filter) => <Link key={filter.label} href={filter.value ? `/learning?type=${filter.value}` : "/learning"} aria-current={type === filter.value ? "page" : undefined} className={`rounded-full border px-4 py-2 text-sm ${type === filter.value ? "border-blue bg-blue/10 text-blue" : "border-foreground/15 text-foreground/60 hover:border-blue/40"}`}>{filter.label}</Link>)}</nav>;
}
