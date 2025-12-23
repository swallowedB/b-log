export type TocItem = {
  id: string;
  text: string;
  level: 2;
};

type VeliteTocNode = {
  title: string;
  url: string;
  items?: VeliteTocNode[]; 
};

function toId(url: string): string {
  return url.startsWith("#") ? url.slice(1) : url;
}

/**
 * Velite TOC (tree)
 * - 루트 노드만 사용
 */
export function adaptVeliteToc(toc: readonly VeliteTocNode[]): TocItem[] {
  return toc.map((node) => ({
    id: toId(node.url),
    text: node.title,
    level: 2,
  }));
}
