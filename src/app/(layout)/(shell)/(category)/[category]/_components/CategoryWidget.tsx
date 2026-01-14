import MissionWidget from "@/app/(layout)/(shell)/(category)/[category]/_components/widget/MissionWidget";
import StatWidget from "@/app/(layout)/(shell)/(category)/[category]/_components/widget/StatWidget";
import { CategoryKey } from "@/config/categories";
import { MONTHLY_CATEGORY_GOALS } from "@/config/categoryGoals.config";
import { getCategoryStats } from "@/lib/posts";

interface Props {
  category: CategoryKey;
}

const CATEGORY_KEYS = Object.keys(MONTHLY_CATEGORY_GOALS) as CategoryKey[];

function isCategoryKey(value: string): value is CategoryKey {
  return CATEGORY_KEYS.includes(value as CategoryKey);
}

export default function CategoryWidget({ category }: Props) {
  if (!isCategoryKey(category)) {
    return null;
  }

  const stats = getCategoryStats({
    category,
    goalThisMonth: MONTHLY_CATEGORY_GOALS[category],
    activityWindowDays: 30,
    activityTargetPosts: 10,
  });

  return (
    <section className="flex flex-col gap-3 md:flex-row">
      <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-4">
        <StatWidget
          label="Total Posts"
          value={String(stats.totalPosts)}
          caption="전체 누적"
        />
        <StatWidget
          label="This Month"
          value={`+${stats.newThisMonth}`}
          caption="이번 달 업데이트"
        />
        <StatWidget
          label="Series Count"
          value={String(stats.seriesCount)}
          caption="시리즈 수"
        />
        <StatWidget
          label="Activity"
          value={`${stats.activityIndex}%`}
          caption="최근 활동지수"
        />
      </div>

      <div className="md:w-[260px] ">
        <MissionWidget
          current={stats.newThisMonth}
          target={stats.goalThisMonth}
        />
      </div>
    </section>
  );
}
