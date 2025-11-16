export function ToggleModeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="194"
      height="194"
      viewBox="0 0 194 194"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g transform="translate(-11.15 -10.392)">
        {/* 외곽 캡슐 */}
        <circle
          cx={108.15}
          cy={107.392}
          r={88}
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth={2}
          fill="none"
        />

        {/* 글로우 */}
        <foreignObject x={0} y={0} width="194" height="194">
          <div
            style={{
              backdropFilter: "blur(8px)",
              height: "100%",
              width: "100%",
            }}
          />
        </foreignObject>

        {/* 캡슐 유리 + 그라데이션 */}
        <g filter="url(#filter0_ddii_168_361)">
          <mask
            id="path-1-outside-1_168_361"
            maskUnits="userSpaceOnUse"
            x="47.1504"
            y="46.392"
            width="122"
            height="122"
          >
            <rect
              x="47.1504"
              y="46.392"
              width="122"
              height="122"
              fill="white"
            />
            <path d="M168.15 107.392C168.15 140.529 141.287 167.392 108.15 167.392C75.0133 167.392 48.1504 140.529 48.1504 107.392C48.1504 74.2549 75.0133 47.392 108.15 47.392C141.287 47.392 168.15 74.2549 168.15 107.392Z" />
          </mask>

          <path
            d="M168.15 107.392C168.15 140.529 141.287 167.392 108.15 167.392C75.0133 167.392 48.1504 140.529 48.1504 107.392C48.1504 74.2549 75.0133 47.392 108.15 47.392C141.287 47.392 168.15 74.2549 168.15 107.392Z"
            fill="white"
            fillOpacity={0.188}
            style={{ mixBlendMode: "plus-lighter" }}
          />
        </g>

        {/* ------------------ 라이트 모드 바디 ------------------ */}
        <g className="light-body dark:hidden">
          <circle
            cx={108.15}
            cy={107.392}
            r={52}
            fill="url(#paint_light_168_361)"
          />
        </g>

        {/* 라이트 모드 눈 */}
        <g className="light-eyes dark:hidden">
          <ellipse cx={97.15} cy={103.4} rx={5} ry={6} fill="white" />
          <ellipse cx={114.15} cy={103.4} rx={5} ry={6} fill="white" />
        </g>

        {/* ------------------ 다크 모드 바디 ------------------ */}
        <g className="dark-body hidden dark:block">
          <circle
            cx={108.15}
            cy={107.392}
            r={52}             
            fill="url(#paint_dark_168_361)"
          />
        </g>

        {/* 다크 모드 눈 */}
        <g className="dark-eyes hidden dark:block"  >
          <path
            d="M100.29 107.392C100.49 107.392 100.65 107.55 100.65 107.75C100.65 110.2 98.59 112.16 96.15 112.16C93.71 112.16 91.72 110.2 91.65 107.79C91.65 107.55 91.81 107.39 92.01 107.39C92.21 107.39 92.37 107.55 92.37 107.75C92.41 109.8 94.09 111.44 96.15 111.44C98.21 111.44 99.89 109.8 99.93 107.75C99.93 107.55 100.09 107.39 100.29 107.39Z"
            fill="#333"
            strokeWidth={3}
            stroke="#333"
          />
          <path
            d="M116.79 107.392C116.99 107.392 117.15 107.55 117.15 107.75C117.15 110.2 115.09 112.16 112.65 112.16C110.21 112.16 108.22 110.2 108.15 107.79C108.15 107.55 108.31 107.39 108.51 107.39C108.71 107.39 108.87 107.55 108.87 107.75C108.92 109.8 110.59 111.44 112.65 111.44C114.71 111.44 116.38 109.8 116.43 107.75C116.43 107.55 116.59 107.39 116.79 107.39Z"
            fill="#333"
            strokeWidth={3}
            stroke="#333"
          />
        </g>
      </g>

      <defs>
        {/* 라이트 바디 그라데이션 */}
        <radialGradient
          id="paint_light_168_361"
          cx="0"
          cy="0"
          r="3"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(108.15 107.392) rotate(90) scale(39)"
        >
          <stop stopColor="#EB8CFF" />
          <stop offset="0.82" stopColor="#3f9cff" />
          <stop offset="1" stopColor="#681790" />
        </radialGradient>

        {/* 다크 바디 그라데이션 */}
        <radialGradient
          id="paint_dark_168_361"
          cx="0"
          cy="0"
          r="1.3"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(108.15 107.392) rotate(90) scale(39)"
        >
          <stop stopColor="#FFECC3" />
          <stop offset="0.8" stopColor="#f8d893" />
          <stop offset="1" stopColor="#ffc131" />
        </radialGradient>

        {/* 외곽 필터 그대로 유지 */}
        <filter>…</filter>
      </defs>
    </svg>
  );
}
