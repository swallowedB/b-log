export default function PostTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-md bg-foreground/5 dark:bg-foreground/12 px-2.5 py-1 text-xs text-foreground/80 transition-colors"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
}
