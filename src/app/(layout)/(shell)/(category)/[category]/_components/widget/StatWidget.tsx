
interface StatWidgetProps {
  label: string;        
  value: string;        
  caption: string;     
}

export default function StatWidget({ label, value, caption }: StatWidgetProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl bg-foreground/4 dark:bg-foreground/8 px-5 py-4">
      <span className="text-xs font-medium text-foreground/60">
        {label}
      </span>

      <span className="text-2xl font-semibold leading-none">
        {value}
      </span>

      <span className="text-[11px] text-foreground/50">
        {caption}
      </span>
    </div>
  );
}
