import { useEffect, useRef } from "react";
import styles from "./AskBoaMascot.module.css";

export type MascotExpression = "idle" | "curious" | "exhausted" | "wink";

export default function AskBoaMascot({ expression, compact = false, trackPointer = true }: {
  expression: MascotExpression;
  compact?: boolean;
  trackPointer?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mascot = ref.current;
    if (!mascot || !trackPointer || expression !== "idle") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lookAtPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || reducedMotion.matches) return;

      const { left, top, width, height } = mascot.getBoundingClientRect();
      const x = event.clientX - left - width / 2;
      const y = event.clientY - top - height / 2;
      const scale = width * 0.065 / Math.max(85, Math.hypot(x, y));
      mascot.style.setProperty("--look-x", `${(x * scale).toFixed(2)}px`);
      mascot.style.setProperty("--look-y", `${(y * scale).toFixed(2)}px`);
    };

    window.addEventListener("pointermove", lookAtPointer, { passive: true });
    return () => window.removeEventListener("pointermove", lookAtPointer);
  }, [trackPointer, expression]);

  return (
    <span ref={ref} aria-hidden="true" data-testid="ask-boa-mascot" data-expression={expression} className={compact ? `${styles.mascot} ${styles.compact}` : styles.mascot}>
      <span className={styles.shell}>
        <span className={styles.screen}>
          <span className={styles.eyes}>
            <span className={styles.eye} />
            <span className={styles.eye} />
          </span>
          <span className={styles.trunk} />
        </span>
      </span>
    </span>
  );
}
