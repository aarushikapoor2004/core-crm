"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarHeader } from "./ui/sidebar";
import { ChevronsRight, PlusCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomerForm } from "./add-customer-form";
import { OrderForm as OrdersForm } from "./add-orders-form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"



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
                setOpen(false)
              }}
              className="ring-offset-background focus:ring-ring  absolute top-4 right-6 rounded-xs   focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none size-7   bg-transparent"
              variant="secondary"
            >
              <ChevronsRight className="size-6" />
            </Button>
          </SidebarHeader>
          <Tabs defaultValue="customers">
            <TabsList className="px-2  gap-2 mx-auto mt-2 ">
              <TabsTrigger value="customers"> Add Customers </TabsTrigger>
              <TabsTrigger value="orders"> Add Ordders</TabsTrigger>
            </TabsList>
            <TabsContent value="customers">
              <CustomerForm />
            </TabsContent>
            <TabsContent value="orders">
              <OrdersForm />
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </SheetContent >
    </Sheet >
  );
}
