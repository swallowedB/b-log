import Image from "next/image";
import clsx from "clsx";

type FigureImage = {
  src: string;
  alt?: string;
};

export default function Figure({
  images,
  caption,
  columns = 2,
}: {
  images: FigureImage[];
  caption?: string;
  columns?: 1 | 2 | 3;
}) {
  const isSingle = images.length === 1;

  return (
    <figure className="my-8">
      <div
        className={clsx(
          "grid gap-3",
          isSingle && "grid-cols-1",
          !isSingle && columns === 1 && "grid-cols-1",
          !isSingle && columns === 2 && "grid-cols-2",
          !isSingle && columns === 3 && "grid-cols-3"
        )}
      >
        {images.map((img, i) => (
          <Image
            key={i}
            src={img.src}
            alt={img.alt ?? ""}
            width={1200}
            height={630}
            className={clsx(
              "rounded-lg border border-neutral-200 dark:border-neutral-800",
              isSingle && "w-full"
            )}
          />
        ))}
      </div>

      {caption && (
        <figcaption className="mt-2 text-center text-xs text-foreground/60">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
