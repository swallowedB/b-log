"use client"
import { useTheme } from "next-themes";
import { ToggleModeIcon } from "./ToggleModeIcon";

export function ToggleModeButton() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  if(!resolvedTheme){
    return null
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = currentTheme === "dark";

  const toggle = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <button type="button" onClick={toggle} aria-pressed={isDark} aria-label="테마 변경" className="cursor-pointer">
      <ToggleModeIcon className="w-12 h-12" />
    </button>
  )
}
