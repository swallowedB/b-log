import MissionWidget from "@/app/(layout)/(shell)/(category)/[category]/_components/widget/MissionWidget";
import StatWidget from "@/app/(layout)/(shell)/(category)/[category]/_components/widget/StatWidget";

export default function CategoryWidget() {
  return (
    <section className="flex flex-col gap-3 md:flex-row">
      {/* 왼쪽: 숫자 위젯 4개 */}
      <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-4">
        <StatWidget label="Total Posts" value="128" caption="전체 누적" />
        <StatWidget
          label="New This Month"
          value="+6"
          caption="이번 달 업데이트"
        />
        <StatWidget label="Series Count" value="6" caption="시리즈 수" />
        <StatWidget label="Activity" value="60%" caption="최근 활동지수" />
      </div>

      {/* 오른쪽: Monthly Mission */}
      <div className="md:w-[260px]">
        <MissionWidget current={6} target={10} />
      </div>
    </section>
  );
}
