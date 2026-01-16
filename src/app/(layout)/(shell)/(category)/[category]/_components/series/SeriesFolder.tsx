import { SeriesItem } from "@/app/(layout)/(shell)/(category)/[category]/_components/CategorySeries";
import SeriesFolderItem from "@/app/(layout)/(shell)/(category)/[category]/_components/series/SeriesFolderItem";

interface Props {
  visible: SeriesItem[];
  activeId?: string | null;
  onSelect: (id: string) => void;
}

export default function SeriesFolder({ visible, activeId, onSelect }: Props) {
  const handleClick = (id: string) => {
    onSelect(id);
    const target = document.getElementById("series-post-section");
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const justifyClass =
    visible.length <= 3 ? "justify-start" : "justify-between";

  return (
    <section>
      <div className={`-ml-4 flex ${justifyClass}`}>
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
              onClick={() => handleClick(series.id)}
            />
          );
        })}
      </div>
    </section>
  );
}
