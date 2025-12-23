"use client";

import "@/styles/components/pagination.css";
import clsx from "clsx";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";

export interface PaginationProps {
  page: number;
  pageRange: number[];

  hasPrev: boolean;
  hasNext: boolean;

  firstPage: number;
  lastPage: number;

  prevPage: number | null;
  nextPage: number | null;

  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  page,
  pageRange,
  hasPrev,
  hasNext,
  firstPage,
  lastPage,
  prevPage,
  nextPage,
  onPageChange,
  className,
}: PaginationProps) {

  if (pageRange.length <= 1) return null;

  return (
    <nav
      aria-label="게시글 페이지네이션"
      className={clsx("flex items-center justify-center", className)}
    >
      <div className="pagination-root">
        {/* 맨 처음 페이지로 */}
        <button
          type="button"
          onClick={() => onPageChange(firstPage)}
          aria-label="첫 페이지"
          disabled={!hasPrev}
          className={clsx(
            "pagination-icon",
            !hasPrev && "pagination-button-disabled"
          )}
        >
          <ChevronsLeftIcon className="h-4 w-4" />
        </button>

        {/* 이전 페이지 */}
        <button
          type="button"
          onClick={() => prevPage && onPageChange(prevPage)}
          aria-label="이전 페이지"
          disabled={!hasPrev}
          className={clsx(
            "pagination-icon",
            !hasPrev && "pagination-button-disabled"
          )}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>

        {/* 페이지 숫자 */}
        <ol className="flex items-center gap-1">
          {pageRange.map((p) =>
            (
              <li key={p}>
                <button
                  type="button"
                  onClick={() => onPageChange(p)}
                  aria-current={p === page ? "page" : undefined}
                  className={clsx(
                    "pagination-page",
                    p === page && "pagination-page-active"
                  )}
                >
                  {p}
                </button>
              </li>
            ))}
        </ol>

        {/* 다음 페이지 */}
        <button
          type="button"
          onClick={() => nextPage && onPageChange(nextPage)}
          aria-label="다음 페이지"
          disabled={!hasNext}
          className={clsx(
            "pagination-icon",
            !hasNext && "pagination-button-disabled"
          )}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>

        {/* 마지막 페이지로 */}
        <button
          type="button"
          onClick={() => onPageChange(lastPage)}
          aria-label="마지막 페이지"
          disabled={!hasNext}
          className={clsx(
            "pagination-icon",
            !hasNext && "pagination-button-disabled"
          )}
        >
          <ChevronsRightIcon className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
