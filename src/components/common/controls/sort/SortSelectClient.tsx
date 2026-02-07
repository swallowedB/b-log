"use client";

import SortSelect, {
  PostSortValue,
} from "@/components/common/controls/sort/SortSelect";
import { useRouter, useSearchParams } from "next/navigation";

interface SortSelectClientProps {
  value: PostSortValue;
}

export default function SortSelectClient({ value }: SortSelectClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const buildUrl = (next: PostSortValue) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", next);
    params.set("page", "1");
    return `?${params.toString()}`;
  };

  const handleChange = (next: PostSortValue) => {
    router.push(buildUrl(next), { scroll: false });
  };

  const handlePrefetch = (next: PostSortValue) => {
    if (next === value) return;
    router.prefetch(buildUrl(next));
  };

  return (
    <SortSelect
      value={value}
      onChange={handleChange}
      onPrefetch={handlePrefetch}
    />
  );
}
