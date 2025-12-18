interface MissionWidgetProps {
  current: number;
  target: number;
  label?: string;
}

export default function MissionWidget({
  current,
  target,
  label = "이번 달 목표를 향해가는 중…",
}: MissionWidgetProps) {
  const ratio = Math.max(
    0,
    Math.min(100, Math.round((current / target) * 100))
  );

  return (
    <aside className="flex flex-col justify-between rounded-2xl bg-foreground/4 dark:bg-foreground/8 px-5 py-4">
      {/* 헤더 영역 */}
      <div className="flex items-center justify-between text-xs font-medium text-foreground/60">
        <p className="text-xl font-semibold leading-none text-blue dark:text-accent ">
          {current}
          <span className="ml-1 text-xs font-normal text-foreground/50">
            / {target} 포스트
          </span>
        </p>
        <span>🔥</span>
      </div>

      {/* 숫자 + 퍼센트 */}

      {/* 프로그레스 바 + 하단 설명 */}
      <div className="mt-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
          <div
            className="h-full rounded-full bg-blue dark:bg-accent "
            style={{ width: `${ratio}%` }}
          />
        </div>
        <div className="mt-1 flex items-end justify-between">
          <p className="mt-2 text-[11px] text-[#0C3469]/80 dark:text-foreground/80 ">{label}</p>
          <span className="text-xs font-medium text-foreground/40 dark:text-foreground/80">
            {ratio}%
          </span>
        </div>
      </div>
    </aside>
  );
}
