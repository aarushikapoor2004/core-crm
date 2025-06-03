"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarHeader } from "./ui/sidebar";
import { ChevronsRight, GitBranchPlus } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SegmentForm } from "./add-segment-from";



export function AddDataButton() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen} >
      <SheetTrigger asChild>
        <Button variant="default" size="sm" onClick={() => setOpen(true)}>
          <GitBranchPlus />
          Add Segment
        </Button>
      </SheetTrigger>

      <SheetContent className=""
        side="page"
        onPointerDownOutside={(e) => e.preventDefault()
        }
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <ScrollArea className="h-screen">
          <SidebarHeader className="relative px-6 pt-4 ">
            <SheetTitle className="font-bold text-xl">Add Segment</SheetTitle>
            <Button
              onClick={() => {
                setOpen(false)
              }}
              className="ring-offset-background focus:ring-ring  absolute top-4 right-6 rounded-xs   focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none size-7   bg-transparent"
              variant="secondary"
            >
              <ChevronsRight className="size-6" />
            </Button>
          </SidebarHeader>

          <SegmentForm />

        </ScrollArea>
      </SheetContent >
    </Sheet >
  );
}
