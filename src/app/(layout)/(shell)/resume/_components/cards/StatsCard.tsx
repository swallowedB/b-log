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
        aria-labelledby="status-heading"
        className="flex h-full flex-col gap-3 scroll-mt-24 sm:px-2 sm:py-1"
      >
        <div className="flex items-center gap-2">
          <h2 id="status-heading" className="text-xl font-semibold text-foreground">{statusSection.title}</h2>
          <StatusInfoPopover scale={statusSection.scale} />
        </div>

        <div className="grid flex-1 items-center gap-4 md:grid-cols-[minmax(9rem,1fr)_minmax(0,2.25fr)] lg:gap-6">
          <div className="flex items-center justify-center">
            <svg
              viewBox="0 -10 220 206"
              className="w-full max-w-[12.5rem]"
              role="img"
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
                      className="fill-foreground/75 font-mono text-[13px]"
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

          <ul className="grid gap-x-5 gap-y-3 sm:grid-cols-2">
            {stats.map((item) => (
              <li key={item.label} className="min-w-0 border-t border-foreground/12 pt-2.5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm leading-5 font-semibold text-foreground">{item.label}</span>
                  <span className="shrink-0 font-mono text-base font-semibold text-sky-800 tabular-nums dark:text-sky-300">{item.value}</span>
                </div>
                <p className="mt-1 text-[13px] leading-5 text-foreground/75">{item.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </ResumeCard>
  );
}
