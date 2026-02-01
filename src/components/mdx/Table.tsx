import clsx from "clsx";
import type { ReactNode, TableHTMLAttributes } from "react";

export type TableProps = {
  caption?: ReactNode;
  className?: string;
  children: ReactNode;
};

function tableInnerClass() {
  return clsx(
    "w-full text-sm border-separate border-spacing-0 rounded-md overflow-hidden",

    "border border-neutral-300 dark:border-white/15",

    " [&_thead_th]:bg-neutral-100 dark:[&_thead_th]:bg-white/5",
    " [&_thead_th]:font-semibold",
    " [&_thead_th]:text-left",
    " [&_thead_th]:px-3 [&_thead_th]:py-2",
    " [&_thead_th]:border-b",
    " [&_thead_th]:border-neutral-300 dark:[&_thead_th]:border-white/15",

    " [&_tbody_td]:px-3 [&_tbody_td]:py-2",
    " [&_tbody_td]:border-b",
    " [&_tbody_td]:border-neutral-200 dark:[&_tbody_td]:border-white/10",

    " [&_th+th]:border-l [&_th+th]:border-neutral-200 dark:[&_th+th]:border-white/10",
    " [&_td+td]:border-l [&_td+td]:border-neutral-200 dark:[&_td+td]:border-white/10",

    " [&_tbody_tr:last-child_td]:border-b-0",

    " [&_tbody_tr:hover]:bg-neutral-50 dark:[&_tbody_tr:hover]:bg-white/5",

    " [&_code]:bg-neutral-100 dark:[&_code]:bg-white/10",
    " [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded"
  );
}

export default function Table({ caption, className, children }: TableProps) {
  return (
    <figure className="my-4 w-full overflow-x-auto">
      <table className={clsx(tableInnerClass(), className)}>
        {caption ? (
          <caption className="caption-bottom text-left pt-2 text-xs text-neutral-500 dark:text-white/50">
            {caption}
          </caption>
        ) : null}
        {children}
      </table>
    </figure>
  );
}


export type TableRootProps = TableHTMLAttributes<HTMLTableElement> & {
  caption?: ReactNode;
};

export function TableRoot({ caption, className, children }: TableRootProps) {
  return (
    <Table caption={caption} className={className}>
      {children}
    </Table>
  );
}
