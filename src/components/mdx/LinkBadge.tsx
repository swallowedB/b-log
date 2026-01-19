import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { FaGithub } from "react-icons/fa";
import { PiRocketLaunchFill } from "react-icons/pi";
import { SiVelog } from "react-icons/si";

type LinkBadgeProps = {
  href: string;
  children: ReactNode;
  icon?: "github" | "deploy" | "velog";
  variant?: "default" | "blue" | "green";
};

export default function LinkBadge({
  href,
  children,
  icon,
  variant = "default",
}: LinkBadgeProps) {
  const icons = {
    github: <FaGithub size={13} />,
    deploy: <PiRocketLaunchFill size={13} />,
    velog: <SiVelog size={13} />,
  };

  const variantClass = {
    default:
      "border-neutral-300/70 text-neutral-800 bg-white dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-700",
    blue: "border-blue-300/70 text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-900/30 dark:border-blue-700",
    green:
      "border-emerald-300/70 text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-900/30 dark:border-emerald-700",
  }[variant];

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`mx-1 no-underline inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1  text-xs font-medium ${variantClass} hover:opacity-90 transition`}
    >
      {icon && <span className="flex items-center">{icons[icon]}</span>}
      <span>{children}</span>
      <ArrowUpRight size={14} className="opacity-80" />
    </Link>
  );
}
