export const DOCK_ITEMS = [
  {
    type: "link" as const,
    label: "DEV_LOG",
    href: "/dev-log",
    icon: "/icons/file-icon.svg",
    tooltip: "Dev_log",
  },
  {
    type: "link" as const,
    label: "INSIGHT",
    href: "/insight",
    icon: "/icons/file-icon.svg",
    tooltip: "Insight",
  },
  {
    type: "link" as const,
    label: "JOURNAL",
    href: "/journal",
    icon: "/icons/file-icon.svg",
    tooltip: "Journal",
  },
  { type: "divider" as const },
  {
    type: "mailto" as const,
    label: "CONTACT",
    href: "mailto:musamea99@gmail.com",
    icon: "/icons/mail-icon.svg",
    tooltip: "Contact",
  },
  {
    type: "button" as const,
    label: "PHOTOBOOTH",
    icon: "/icons/photobooth-icon.svg",
    tooltip: "Photobooth",
    onClick: () => console.log("Photobooth click"), // 임시
  },
] as const;
