"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarHeader } from "./ui/sidebar";
import { ChevronsRight, PlusCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomerForm } from "./add-customer-schema";


export function AddDataButton() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen} >
      <SheetTrigger asChild>
        <Button variant="default" size="sm" onClick={() => setOpen(true)}>
          <PlusCircle className="h-4 w-4" />
          Add Data
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
            <SheetTitle className="font-bold text-xl">Add Data </SheetTitle>
            <Button
              onClick={() => {
                // form.reset()
                setOpen(false)
              }}
              className="ring-offset-background focus:ring-ring  absolute top-4 right-6 rounded-xs   focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none size-7   bg-transparent"
              variant="secondary"
            >
              <ChevronsRight className="size-6" />
            </Button>
          </SidebarHeader>
          <CustomerForm />
        </ScrollArea>
      </SheetContent >
    </Sheet >
  );
}
