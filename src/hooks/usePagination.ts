import { useMemo, useCallback } from "react";
import { getPageNumbers, type PageItem } from "@/utils/pagination/getPageNumbers";

interface UsePaginationOptions {
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange?: (page: number) => void;
}

export function usePagination({
  totalCount,
  page,
  pageSize,
  onPageChange,
}: UsePaginationOptions) {
  const pageCount = useMemo(
    () => Math.ceil(totalCount / pageSize),
    [totalCount, pageSize],
  );

  const isFirstPage = page === 1;
  const isLastPage = page === pageCount;

  const handlePageChange = useCallback(
    (nextPage: number) => {
      if (!onPageChange) return;
      if (nextPage < 1 || nextPage > pageCount) return;
      if (nextPage === page) return;
      onPageChange(nextPage);
    },
    [onPageChange, page, pageCount],
  );

  const pages: PageItem[] = useMemo(
    () => getPageNumbers(page, pageCount),
    [page, pageCount],
  );

  return {
    pageCount,
    isFirstPage,
    isLastPage,
    pages,
    handlePageChange,
  };
}
