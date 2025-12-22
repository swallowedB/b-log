function StepsRoot({ children }: { children: React.ReactNode }) {
  return <ol className="my-6 space-y-4">{children}</ol>;
}

function StepItem({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="rounded-md border border-neutral-200 p-4 dark:border-neutral-800">
      <h4 className="mb-1 text-sm font-semibold">{title}</h4>
      <div className="text-sm text-foreground/80">{children}</div>
    </li>
  );
}

const Steps = Object.assign(StepsRoot, {
  Item: StepItem,
});

export default Steps;
