"use client"

import * as React from "react"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { sidebarNavigationSection as data } from "@/constants";

export function SearchCommand() {
  const [open, setOpen] = useState(false)
  const { setTheme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="bg- relative h-8 justify-between rounded-[0.5rem] text-sm text-muted-foreground w-64"
        onClick={() => setOpen(true)}
      >
        <span className="flex jutify-center items-center">
          <Search className="mr-2" /> Search...
        </span>
        <kbd className="pointer-events-none h-5 select-none flex items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs my-auto">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Links">

            {data.map((section) =>
              section.items.map((item) =>
                item.isCollapsible && item.subItems ? (
                  item.subItems.map((subItem) => (
                    <CommandItem
                      key={subItem.subItemName}
                      onSelect={() => runCommand(() => router.push(subItem.url))}
                    >
                      <span className="flex gap-2">
                        {item.icon && <item.icon />} {item.itemName + " > " + subItem.subItemName}
                      </span>
                    </CommandItem>
                  ))
                ) : (
                  <CommandItem
                    key={item.itemName}
                    onSelect={() => runCommand(() => router.push(item.url || "#"))}
                  >
                    <span className="flex gap-2">
                      {item.icon && <item.icon />} {item.itemName}
                    </span>
                  </CommandItem>
                )
              )
            )}

          </CommandGroup>
          <CommandGroup heading="Themes">
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <span className="flex gap-2">
                <Moon /> Dark
              </span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <span className="flex gap-2">
                <Sun /> Light
              </span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog >
    </>
  )
}


