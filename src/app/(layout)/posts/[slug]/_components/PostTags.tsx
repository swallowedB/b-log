export default function PostTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2 mb-10">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-foreground/5 dark:bg-foreground/12 px-3 py-1 text-xs text-foreground/80 transition-colors border border-white/50"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
