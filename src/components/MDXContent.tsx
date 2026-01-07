import CodeBlockFigure from "@/components/mdx/CodeBlock";
import type { ComponentType, ReactElement } from "react";
import * as runtime from "react/jsx-runtime";

export type MDXComponents = Record<string, ComponentType<Record<string, unknown>>>;

type MDXModule = {
  default: ComponentType<{ components?: MDXComponents }>;
};

const defaultMdxComponents: MDXComponents = {
  figure: CodeBlockFigure as ComponentType<Record<string, unknown>>,
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

  const mergedComponents: MDXComponents = {
    ...defaultMdxComponents,
    ...(components ?? {}),
  };

  return <Component components={mergedComponents} />;
}
