export type PageItem =
  | { type: "page"; value: number }
  | { type: "ellipsis" };

export function getPageNumbers(current: number, pageCount: number): PageItem[] {
  const items: PageItem[] = [];

  if (pageCount <= 7) {
    for (let i = 1; i <= pageCount; i++) {
      items.push({ type: "page", value: i });
    }
    return items;
  }

  const addPage = (value: number) => {
    items.push({ type: "page", value });
  };

  const addEllipsis = () => {
    if (items[items.length - 1]?.type !== "ellipsis") {
      items.push({ type: "ellipsis" });
    }
  };

  const first = 1;
  const last = pageCount;

  const start = Math.max(current - 1, 2);
  const end = Math.min(current + 1, pageCount - 1);

  addPage(first);

  if (start > 2) addEllipsis();

  for (let i = start; i <= end; i++) {
    addPage(i);
  }

  if (end < pageCount - 1) addEllipsis();

  addPage(last);

  return items;
}