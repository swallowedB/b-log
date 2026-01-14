import type { VelitePost } from "./source";
import { getAllPosts } from "./queries";
import { CategoryKey } from "@/config/categories";
import { SERIES_META_BY_CATEGORY } from "@/lib/posts/registry/series.registry";

export interface CategoryStatsParams {
  category: CategoryKey;
  now?: Date; 
  includeDrafts?: boolean;

  goalThisMonth?: number; // 이번달 목표 포스트 수
  activityWindowDays?: number; // 최근 활동 범위 (기본 30일)
  activityTargetPosts?: number; 
}

export interface CategoryStats {
  category: string;

  totalPosts: number;         // 전체 누적
  newThisMonth: number;       // 이번 달 업데이트
  seriesCount: number;        // 시리즈 수

  activityIndex: number;      // 0~100
  activityWindowDays: number; // 표시용

  goalThisMonth: number;      // 목표(설정값)
  goalProgress: number;       // 0~100
}

function toYYYYMM(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function yyyymmddToDate(value: string): Date | null {
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function isWithinLastNDays(postDateYYYYMMDD: string, now: Date, days: number): boolean {
  const dt = yyyymmddToDate(postDateYYYYMMDD);
  if (!dt) return false;
  const ms = days * 24 * 60 * 60 * 1000;
  return now.getTime() - dt.getTime() <= ms;
}

function filterByCategory(posts: VelitePost[], category: string): VelitePost[] {
  return posts.filter((p) => p.category === category);
}

export function getCategoryStats(params: CategoryStatsParams): CategoryStats {
  const {
    category,
    now = new Date(),
    includeDrafts = false,
    goalThisMonth = 0,
    activityWindowDays = 30,
    activityTargetPosts = 10,
  } = params;

  const all = getAllPosts({ includeDrafts });
  const catPosts = filterByCategory(all, category);

  const totalPosts = catPosts.length;

  const thisYYYYMM = toYYYYMM(now);
  const newThisMonth = catPosts.filter((p) => p.date.startsWith(thisYYYYMM)).length;

  const seriesMeta = SERIES_META_BY_CATEGORY[category] ?? [];
  const seriesCount = seriesMeta.length;

  const recentCount = catPosts.filter((p) =>
    isWithinLastNDays(p.date, now, activityWindowDays)
  ).length;

  const activityIndex =
    activityTargetPosts <= 0
      ? 0
      : Math.min(100, Math.round((recentCount / activityTargetPosts) * 100));

  const goalProgress =
    goalThisMonth <= 0
      ? 0
      : Math.min(100, Math.round((newThisMonth / goalThisMonth) * 100));

  return {
    category,
    totalPosts,
    newThisMonth,
    seriesCount,
    activityIndex,
    activityWindowDays,
    goalThisMonth,
    goalProgress,
  };
}
