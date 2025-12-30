import { SeriesItem } from "@/app/(layout)/(shell)/(category)/[category]/_components/CategorySeries";
import SeriesFolderItem from "@/app/(layout)/(shell)/(category)/[category]/_components/series/SeriesFolderItem";

interface Props {
  visible: SeriesItem[];
  activeId?: string | null;
  onSelect: (id: string) => void;
}

export default function SeriesFolder({ visible, activeId, onSelect }: Props) {
  return (
    <section>
      <div className="-ml-4 flex gap-7 justify-">
        {visible.map((series) => {
          const isActive = series.id === activeId;

          return (
            <SeriesFolderItem
              key={series.id}
              id={series.id}
              name={series.name}
              postCount={series.postCount}
              tone={series.tone}
              isActive={isActive}
              onClick={() => onSelect(series.id)}
            />
          );
        })}
      </div>
    </section>
  );
}
