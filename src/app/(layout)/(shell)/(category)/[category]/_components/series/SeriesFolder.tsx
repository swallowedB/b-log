import SeriesFolderItem from "@/app/(layout)/(shell)/(category)/[category]/_components/series/SeriesFolderItem";
import { SeriesItem } from "@/app/(layout)/(shell)/(category)/_constants/mockSeriesItem";

export default function SeriesFolder({ visible }: { visible: SeriesItem[] }) {
  return (
    <section>
      <div className="-ml-4 flex gap-7 justify-between">
        {visible.map((series) => (
          <SeriesFolderItem
            key={series.id}
            name={series.name}
            postCount={series.postCount}
            tone={series.tone}
          />
        ))}
      </div>
    </section>
  );
}
