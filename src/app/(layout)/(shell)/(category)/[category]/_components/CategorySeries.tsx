"use client";
import SeriesFolder from "@/app/(layout)/(shell)/(category)/[category]/_components/series/SeriesFolder";
import SeriesHeader from "@/app/(layout)/(shell)/(category)/[category]/_components/series/SeriesHeader";
import SeriesList from "@/app/(layout)/(shell)/(category)/[category]/_components/series/SeriesPostList";
import {
  MOCK_SERIES,
  VISIBLE_COUNT,
} from "@/app/(layout)/(shell)/(category)/_constants/mockSeriesItem";
import { useState } from "react";

export default function CategorySeries() {
  const [startIndex, setStartIndex] = useState(0);

  const total = MOCK_SERIES.length;
  const canPrev = startIndex > 0;
  const canNext = startIndex + VISIBLE_COUNT < total;

  const visible = MOCK_SERIES.slice(startIndex, startIndex + VISIBLE_COUNT);

  const handlePrev = () => {
    if (!canPrev) return;
    setStartIndex((prev) => Math.max(0, prev - VISIBLE_COUNT));
  };

  const handleNext = () => {
    if (!canNext) return;
    setStartIndex((prev) =>
      Math.min(total - VISIBLE_COUNT, prev + VISIBLE_COUNT)
    );
  };
  return (
    <section className="max-w-full mt-4">
      <SeriesHeader
        handlePrev={handlePrev}
        handleNext={handleNext}
        canPrev={canPrev}
        canNext={canNext}
      />
      <SeriesFolder visible={visible} />
      <SeriesList />
    </section>
  );
}
