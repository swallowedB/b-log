import Image from "next/image";

export default function Figure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt?: string;
  caption?: string;
}) {
  return (
    <figure className="my-8">
      <Image
        src={src}
        alt={alt ?? ""}
        width={1200}
        height={630}
        className="rounded-lg border border-neutral-200 dark:border-neutral-800"
      />
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-foreground/60">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
