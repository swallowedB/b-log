import clsx from "clsx";

interface LabelProps {
  text?: string;
  className?: string;
}

export default function Label({ text = "ON AIR", className }: LabelProps) {
  const labelText = text.toUpperCase();

  return (
    <span
      className={clsx(
        "inline-flex select-none items-center gap-1.5 rounded-full",
        "border border-blue/45 bg-linear-to-r from-blue/14 via-muted/16 to-background/72",
        "pr-2.5 pl-2 py-1.5 font-mono font-semibold leading-none",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_0_16px_-8px_rgba(14,165,233,0.6)] backdrop-blur-sm",
        "dark:border-blue/50 dark:from-blue/20 dark:via-muted/20 dark:to-background/20 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_20px_-8px_rgba(14,165,233,0.45)]",
        className,
      )}
    >
      <span className="relative inline-flex size-1.5 items-center justify-center text-blue">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-65" />
        <span className="relative inline-flex size-1.5 rounded-full bg-current" />
      </span>
      <span className="text-[9px] tracking-[0.14em] text-blue md:text-[10px]">
        {labelText}
      </span>
    </span>
  );
}
