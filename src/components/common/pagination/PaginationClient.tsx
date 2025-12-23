"use client";

import Pagination from "@/components/common/pagination/Pagination";
import { PaginatedResult, VelitePost } from "@/lib/posts";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationClientProps {
  pagination: PaginatedResult<VelitePost>;
  pageRange: number[];
}

export default function PaginationClient({
  pagination,
  pageRange,
}: PaginationClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`, { scroll: false });
  }

  return (
    <Pagination
      page={pagination.page}
      pageRange={pageRange}
      hasPrev={pagination.hasPrev}
      hasNext={pagination.hasNext}
      firstPage={pagination.firstPage}
      lastPage={pagination.lastPage}
      prevPage={pagination.prevPage}
      nextPage={pagination.nextPage}
      onPageChange={goToPage}
    />
  );
}
