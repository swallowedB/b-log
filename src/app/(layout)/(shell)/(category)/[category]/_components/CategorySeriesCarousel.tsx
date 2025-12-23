"use client";

import { SeriesItem } from "@/app/(layout)/(shell)/(category)/[category]/_components/CategorySeries";
import SeriesFolder from "@/app/(layout)/(shell)/(category)/[category]/_components/series/SeriesFolder";
import SeriesHeader from "@/app/(layout)/(shell)/(category)/[category]/_components/series/SeriesHeader";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function CategorySeriesCarousel({
  items,
  visibleCount,
}: {
  items: SeriesItem[];
  visibleCount: number;
}) {
  const router = useRouter();
  const sp = useSearchParams();

  const activeSeriesId = sp.get("series");

  const [startIndex, setStartIndex] = useState(0);

  const total = items.length;
  const canPrev = startIndex > 0;
  const canNext = startIndex + visibleCount < total;

  const visible = useMemo(
    () => items.slice(startIndex, startIndex + visibleCount),
    [items, startIndex, visibleCount]
  );

  const handlePrev = () => {
    if (!canPrev) return;
    setStartIndex((prev) => Math.max(0, prev - visibleCount));
  };

  const handleNext = () => {
    if (!canNext) return;
    setStartIndex((prev) =>
      Math.min(total - visibleCount, prev + visibleCount)
    );
  };

  const handleSelectSeries = (seriesId?: string) => {
    const next = new URLSearchParams(sp.toString());

    if (!seriesId) next.delete("series");
    else next.set("series", seriesId);

    next.set("page", "1");
    router.push(`?${next.toString()}`, { scroll: false });
  };

  return (
    <>
      <SeriesHeader
        handlePrev={handlePrev}
        handleNext={handleNext}
        canPrev={canPrev}
        canNext={canNext}
      />
      <SeriesFolder
        visible={visible}
        activeId={activeSeriesId}
        onSelect={handleSelectSeries}
      />
    </>
  );
}
