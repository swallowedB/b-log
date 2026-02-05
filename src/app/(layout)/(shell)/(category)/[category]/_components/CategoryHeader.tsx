interface CategoryHeaderProps {
  title: string;
  description: string;
}

export default function CategoryHeader({ title, description }: CategoryHeaderProps) {
  return (
    <header className="flex flex-col gap-2 items-baseline">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
        {title}
      </h1>
      <p className="text-xs leading-relaxed text-foreground/70 md:text-sm">
        : {description}
      </p>
    </header>
  );
}