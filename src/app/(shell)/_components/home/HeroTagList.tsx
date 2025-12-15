"use client"

interface HeroTagListProps {
  tags: readonly string[];
}

export default function HeroTagList({ tags }: HeroTagListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag}
          className="rounded-full border px-3 py-1 text-[10px] md:text-xs opacity-80 transition hover:opacity-100 dark:glass-tag-on"
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
