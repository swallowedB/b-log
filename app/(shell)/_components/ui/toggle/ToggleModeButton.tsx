import { ToggleModeIcon } from "./ToggleModeIcon";

export function ToggleModeButton() {
  return (
    <button type="button" aria-label="테마 변경" className="cursor-pointer">
      <ToggleModeIcon className="w-12 h-12" />
    </button>
  )
}
