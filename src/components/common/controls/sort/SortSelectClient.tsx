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

  const handleChange = (next: PostSortValue) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("sort", next);
    params.set("page", "1");

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return <SortSelect value={value} onChange={handleChange} />;
}
