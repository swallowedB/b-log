import * as runtime from "react/jsx-runtime";
import type { ComponentType, ReactElement } from "react";


export type MDXComponents = Record<string, ComponentType<unknown>>;

type MDXModule = {
  default: ComponentType<{ components?: MDXComponents }>;
};

function isMDXModule(value: unknown): value is MDXModule {
  return (
    typeof value === "object" &&
    value !== null &&
    "default" in value &&
    typeof (value as { default: unknown }).default === "function"
  );
}

export function MDXContent({
  content,
  components,
}: {
  content: string;
  components?: MDXComponents;
}): ReactElement {
  const result: unknown = new Function(content)({ ...runtime });

  if (!isMDXModule(result)) {
    throw new Error("Invalid MDX module output");
  }

  const Component = result.default;
  return <Component components={components} />;
}
