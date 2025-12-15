import { SearchIcon } from "lucide-react";

export default function SearchBar() {
  return (
    <form
      role="search"
      className="relative bg-foreground/10 rounded-full w-full py-3 px-5 glass-basic text-sm font-medium "
    >
      <input
        id="hero-search"
        name="search"
        placeholder="검색어를 입력하세요..." 
        type="search" className="w-full pr-8 focus:outline-none " />
      <button
        type="submit"
        aria-label="검색"
        className="absolute right-3.5 top-2 bg-foreground/10 rounded-full p-1.5"
      >
        <SearchIcon className="text-foreground " size={18} aria-hidden="true" />
      </button>
    </form>
  );
}
