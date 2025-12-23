import clsx from "clsx";

type CalloutType = "info" | "warning" | "success" | "note";

const styles: Record<CalloutType, string> = {
  info: "border-blue-400/40 bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-100",
  warning:
    "border-yellow-400/40 bg-yellow-50 text-yellow-900 dark:bg-yellow-950/40 dark:text-yellow-100",
  success:
    "border-green-400/40 bg-green-50 text-green-900 dark:bg-green-950/40 dark:text-green-100",
  note: "border-neutral-300 bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100",
};

export default function Callout({
  type = "info",
  children,
}: {
  type?: CalloutType;
  children: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        "my-6 rounded-lg border px-4 py-3 text-sm leading-relaxed",
        styles[type],
      )}
    >
      {children}
    </div>
  );
}
