import Image from "next/image";

type PostThumbnailProps = {
  thumbnail?: string;
  title: string;
};

export default function PostThumbnail({
  thumbnail,
  title,
}: PostThumbnailProps) {
  return (
    <div className="mb-2 overflow-hidden rounded-2xl bg-white/10 border border-white/40 p-1 h-28">
      <div className="relative h-full w-full ">
        <Image
          src={thumbnail || '/post-fallback.png'}
          alt={title+"썸네일 이미지"}
          fill
          className="object-cover object-center rounded-xl"
          priority={false}
        />
      </div>
    </div>
  );
}
