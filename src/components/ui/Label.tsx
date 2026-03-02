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
        "inline-flex select-none items-center gap-1 rounded-full",
        "bg-blue/10 backdrop-blur-sm",
        "border border-blue/60",
        "pr-2 pl-2 py-1.5 font-medium leading-none",
        className,
      )}
    >
      <span className="relative inline-flex size-1.5 items-center justify-center text-blue">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-65" />
        <span className="relative inline-flex size-1.5 rounded-full bg-current" />
      </span>
      <span className="text-[8px] md:text-[9px] lg:text-[10px] text-blue">
        {labelText}
      </span>
    </span>
  );
}
