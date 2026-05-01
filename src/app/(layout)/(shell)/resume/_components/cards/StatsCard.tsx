import {
  getHexagonPoints,
  radarCenter,
  radarGridLevels,
  radarRadius,
} from "../../_constants/resume.chart";
import { stats, statusSection } from "../../_constants/resume.data";
import ResumeCard from "../ResumeCard";
import StatusInfoPopover from "../StatusInfoPopover";
import type { ResumeCardSlotProps } from "./card.types";

export default function StatsCard({ className, animationDelay }: ResumeCardSlotProps) {
  const radarValuePoints = getHexagonPoints(
    radarRadius,
    stats.map((item) => item.value),
  );

  return (
    <ResumeCard animationDelay={animationDelay} className={className}>
      <section
        id="stats"
        className="grid h-full min-h-0 gap-3 scroll-mt-24 pr-4 md:grid-cols-[0.4fr_1.05fr]"
      >
        <div className="flex min-h-0 flex-col gap-2">
          <div className="flex shrink-0 items-center">
            <div className="relative flex items-center gap-1.5">
              <h2 className="text-sm font-semibold text-foreground">{statusSection.title}</h2>
              <StatusInfoPopover scale={statusSection.scale} />
            </div>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center">
            <svg
              viewBox="0 0 220 196"
              className="h-full max-h-60 w-full max-w-[16rem]"
              aria-label="stats hexagon chart"
            >
              {radarGridLevels.map((level) => (
                <polygon
                  key={level}
                  points={getHexagonPoints(radarRadius * level)}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-slate-200 dark:text-white/10"
                />
              ))}

              {stats.map((item, index) => {
                const angle = -Math.PI / 2 + (Math.PI * 2 * index) / 6;
                const lineX = radarCenter.x + Math.cos(angle) * radarRadius;
                const lineY = radarCenter.y + Math.sin(angle) * radarRadius;
                const labelRadius = radarRadius + 17;
                const labelX = radarCenter.x + Math.cos(angle) * labelRadius;
                const labelY = radarCenter.y + Math.sin(angle) * labelRadius;
                const textAnchor =
                  Math.cos(angle) > 0.3
                    ? ("start" as const)
                    : Math.cos(angle) < -0.3
                      ? ("end" as const)
                      : ("middle" as const);

                return (
                  <g key={item.label}>
                    <line
                      x1={radarCenter.x}
                      y1={radarCenter.y}
                      x2={lineX}
                      y2={lineY}
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-slate-200 dark:text-white/10"
                    />
                    <text
                      x={labelX}
                      y={labelY}
                      textAnchor={textAnchor}
                      className="fill-foreground/45 font-mono text-[9px]"
                    >
                      {item.short}
                    </text>
                  </g>
                );
              })}

              <polygon
                points={radarValuePoints}
                fill="rgba(14,165,233,0.18)"
                stroke="rgb(14,165,233)"
                strokeWidth="1.5"
              />

              {stats.map((item, index) => {
                const angle = -Math.PI / 2 + (Math.PI * 2 * index) / 6;
                const x = radarCenter.x + Math.cos(angle) * radarRadius * (item.value / 100);
                const y = radarCenter.y + Math.sin(angle) * radarRadius * (item.value / 100);

                return <circle key={item.label} cx={x} cy={y} r="3" fill="rgb(14,165,233)" />;
              })}
            </svg>
          </div>
        </div>

        <div className="grid self-start gap-x-4 gap-y-2 md:grid-cols-2 pt-3">
          {stats.map((item) => (
            <div
              key={item.label}
              className="border-t border-slate-200/75 pt-2 dark:border-white/8"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-medium text-foreground/72">{item.label}</span>
                <span className="font-mono text-[10px] text-blue">{item.value}</span>
              </div>
              <p className="mt-1 text-[8px] text-foreground/48">{item.note}</p>
            </div>
          ))}
        </div>
      </section>
    </ResumeCard>
  );
}
