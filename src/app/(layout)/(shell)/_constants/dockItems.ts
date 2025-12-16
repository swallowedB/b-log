import FileIcon from "@/assets/svg/FileIcon.svg";
import MailIcon from "@/assets/svg/MailIcon.svg";
import PhotoboothIcon from "@/assets/svg/PhotoboothIcon.svg";

export const DOCK_ITEMS = [
  {
    type: "link" as const,
    label: "DEV_LOG",
    href: "/DEV_LOG",
    icon: FileIcon,
    tooltip: "Dev_log",
  },
  {
    type: "link" as const,
    label: "INSIGHT",
    href: "/INSIGHT",
    icon: FileIcon,
    tooltip: "Insight",
  },
  {
    type: "link" as const,
    label: "JOURNAL",
    href: "/JOURNAL",
    icon: FileIcon,
    tooltip: "Journal",
  },
  { type: "divider" as const },
  {
    type: "mailto" as const,
    label: "CONTACT",
    href: "mailto:musamea99@gmail.com",
    icon: MailIcon,
    tooltip: "Contact",
  },
  {
    type: "button" as const,
    label: "PHOTOBOOTH",
    icon: PhotoboothIcon,
    tooltip: "Photobooth",
    onClick: () => console.log("Photobooth click"), // 임시
  },
] as const;
