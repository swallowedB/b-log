import clsx from "clsx";
import Image from "next/image";

type FigureImage = {
  src: string;
  alt?: string;
};

export default function Figure({
  images,
  caption,
  columns = 2,
  maxWidth = "100%",
  align = "center",
}: {
  images: FigureImage[];
  caption?: string;
  columns?: 1 | 2 | 3;
  maxWidth?: number | string;
  align?: "left" | "center" | "right";
}) {
  const isSingle = images.length === 1;
  const isThree = images.length === 3;

  return (
    <figure
      className={clsx("mb-6", {
        "mx-auto": align === "center",
        "ml-0 mr-auto": align === "left",
        "ml-auto mr-0": align === "right",
      })}
      style={{
        maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
      }}
    >
      {isThree ? (
        <div className="grid">
          <div className="grid grid-cols-[auto_auto] gap-3">
            {images.slice(0, 2).map((img, i) => (
              <Image
                key={i}
                src={img.src}
                alt={img.alt ?? ""}
                width={1200}
                height={630}
                className="rounded-lg border border-neutral-200 dark:border-neutral-800 -mt-2 w-full"
              />
            ))}
          </div>

          <div className="flex justify-center">
            <Image
              src={images[2].src}
              alt={images[2].alt ?? ""}
              width={1200}
              height={630}
              className="rounded-lg border border-neutral-200 dark:border-neutral-800 -mt-2 w-full max-w-[50%]"
            />
          </div>
        </div>
      ) : (
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
                "rounded-lg border border-neutral-200 dark:border-neutral-800 -mt-2",
                isSingle && "w-full"
              )}
            />
          ))}
        </div>
      )}
      {caption && (
        <figcaption className="text-center text-xs text-foreground/60 -mt-5">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
