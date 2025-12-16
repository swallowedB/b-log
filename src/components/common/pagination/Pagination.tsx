"use client";

import { usePagination } from "@/hooks/usePagination";
import "@/styles/components/pagination.css";
import clsx from "clsx";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";

export interface PaginationProps {
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export default function Pagination({
  totalCount,
  page,
  pageSize,
  onPageChange,
  className,
}: PaginationProps) {
  const { pageCount, isFirstPage, isLastPage, pages, handlePageChange } =
    usePagination({ totalCount, page, pageSize, onPageChange });

  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label="게시글 페이지네이션"
      className={clsx("flex items-center justify-center", className)}
    >
      <div className="pagination-root">
        {/* 맨 처음 페이지로 */}
        <button
          type="button"
          onClick={() => handlePageChange(1)}
          aria-label="첫 페이지"
          disabled={isFirstPage}
          className={clsx(
            "pagination-icon",
            isFirstPage && "pagination-button-disabled"
          )}
        >
          <ChevronsLeftIcon className="h-4 w-4" />
        </button>

        {/* 이전 페이지 */}
        <button
          type="button"
          onClick={() => handlePageChange(page - 1)}
          aria-label="이전 페이지"
          disabled={isFirstPage}
          className={clsx(
            "pagination-icon",
            isFirstPage && "pagination-button-disabled"
          )}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>

        {/* 페이지 숫자 */}
        <ol className="flex items-center gap-1">
          {pages.map((item, idx) =>
            item.type === "page" ? (
              <li key={item.value}>
                <button
                  type="button"
                  onClick={() => handlePageChange(item.value)}
                  aria-current={item.value === page ? "page" : undefined}
                  className={clsx(
                    "pagination-page",
                    item.value === page && "pagination-page-active"
                  )}
                >
                  {item.value}
                </button>
              </li>
            ) : (
              <li key={`ellipsis-${idx}`} className="pagination-ellipsis">
                …
              </li>
            )
          )}
        </ol>

        {/* 다음 페이지 */}
        <button
          type="button"
          onClick={() => handlePageChange(page + 1)}
          aria-label="다음 페이지"
          disabled={isLastPage}
          className={clsx(
            "pagination-icon",
            isLastPage && "pagination-button-disabled"
          )}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>

        {/* 마지막 페이지로 */}
        <button
          type="button"
          onClick={() => handlePageChange(pageCount)}
          aria-label="마지막 페이지"
          disabled={isLastPage}
          className={clsx(
            "pagination-icon",
            isLastPage && "pagination-button-disabled"
          )}
        >
          <ChevronsRightIcon className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
