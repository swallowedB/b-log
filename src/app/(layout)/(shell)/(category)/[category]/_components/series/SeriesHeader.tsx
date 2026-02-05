import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  handlePrev: () => void;
  handleNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}

export default function SeriesHeader({
  handlePrev,
  handleNext,
  canPrev,
  canNext,
}: Props) {
  return (
    <header className="mb-4 flex items-center justify-between">
      <h2 className="text-2xl font-semibold text-foreground/50">SERIES</h2>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handlePrev}
          disabled={!canPrev}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-foreground/70 disabled:opacity-40"
          aria-label="이전 시리즈"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canNext}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-foreground/70 disabled:opacity-40"
          aria-label="다음 시리즈"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
