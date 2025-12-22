export default function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="my-6">
      <h3 className="mb-2 text-sm font-semibold text-foreground/70">
        {title}
      </h3>
      <div className="space-y-2 text-sm leading-relaxed text-foreground/90">
        {children}
      </div>
    </section>
  );
}
