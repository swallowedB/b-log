"use client";

import useCommandPaletteInternal from "@/hooks/useCommandPaletteInternal";
import * as Dialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { createContext, useContext, type ReactNode } from "react";

export type CommandItem = {
  id: string;
  label: string;
  hint?: string;
  href?: string;
  searchableText?: string;
};

type CommandPaletteContextValue = {
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;
};

interface CommandPaletteProviderProps {
  children: ReactNode;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(
  null,
);

export function useCommandPalette() {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error(
      "useCommandPalette must be used within CommandPaletteProvider",
    );
  }
  return ctx;
}

export function CommandPaletteProvider({
  children,
}: CommandPaletteProviderProps) {
  const {
    open,
    query,
    displayItems,
    openPalette,
    closePalette,
    togglePalette,
    setQuery,
    handleSelect,
    handleOpenChange,
  } = useCommandPaletteInternal();

  return (
    <CommandPaletteContext.Provider
      value={{ openPalette, closePalette, togglePalette }}
    >
      <Dialog.Root open={open} onOpenChange={handleOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm" />

          <Dialog.Content
            className={clsx(
              "fixed inset-x-3 top-[18%] z-70 w-auto rounded-2xl border border-white/10",
              "bg-foreground/80 text-background shadow-2xl dark:bg-foreground",
              "max-h-[70vh]",
              "sm:left-1/2 sm:top-50 sm:w-full sm:max-w-xl sm:-translate-x-1/2 sm:inset-x-auto",
            )}
          >
            <Dialog.Title className="sr-only">사이트 검색</Dialog.Title>

            <Command className="flex max-h-[70vh] flex-col overflow-hidden rounded-2xl bg-transparent text-sm text-background">
              <div className="flex items-center gap-2 border-b border-white/10 px-3">
                <Search className="h-4 w-4 text-background" />
                <Command.Input
                  autoFocus
                  value={query}
                  onValueChange={setQuery}
                  placeholder="무엇을 찾고 계신가요?"
                  className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-background/70"
                />
                <span className="hidden rounded bg-foreground/70 px-1.5 py-0.5 text-[10px] text-white sm:inline-block dark:bg-background/30">
                  ESC
                </span>
              </div>

              <Command.List
                className={clsx(
                  "max-h-[60vh] overflow-y-auto py-2",
                  "scrollbar-thin scrollbar-thumb scrollbar-track-transparent",
                  "hover:scrollbar-thumb-hover",
                )}
              >
                <Command.Empty className="px-4 py-3 text-xs text-background/70">
                  검색 결과가 없습니다.
                </Command.Empty>

                <Command.Group className="px-2 pt-1">
                  {displayItems.map((item) => (
                    <Command.Item
                      key={item.id}
                      value={item.label}
                      onSelect={() => handleSelect(item)}
                      className="flex cursor-pointer flex-col gap-0.5 rounded-xl px-3 py-2 text-sm aria-selected:bg-background/10"
                    >
                      <span className="font-medium">{item.label}</span>
                      {item.hint && (
                        <span className="text-xs text-background/70">
                          {item.hint}
                        </span>
                      )}
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      {children}
    </CommandPaletteContext.Provider>
  );
}
