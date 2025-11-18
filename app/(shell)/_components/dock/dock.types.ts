export type IconStyle = {
  scale: number;
  translateY: number;
};

export type DockState = "expanded" | "collapsed" | "hidden";

export type DockIconModule = {
  src: string;
};

interface BaseDockItem {
  label: string;
  icon: DockIconModule;         
  tooltip?: string;
}

export interface DockLinkItem extends BaseDockItem {
  type: "link";
  href: string;
}

export interface DockMailItem extends BaseDockItem {
  type: "mailto";
  href: string;
}

export interface DockButtonItem extends BaseDockItem {
  type: "button";
  onClick: () => void;
}

export interface DockDividerItem {
  type: "divider";
  label?: never;
  icon?: never;
  href?: never;
  onClick?: never;
  tooltip?: never;
}

export type DockItem =
  | DockLinkItem
  | DockMailItem
  | DockButtonItem
  | DockDividerItem;

export interface DockMenuItemProps {
  item: Exclude<DockItem, DockDividerItem>;
  style: IconStyle;
  onRef: (el: HTMLLIElement | null) => void;
}