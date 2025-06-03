"use client";
import { AddDataButton } from "@/components/add-segment-button";
import { GitGraph } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

export default function MainHomePage() {

  return (
    <div className="space-y-3">
      <div className="w-full">
        <div className="flex justify-between pt-2">
          <div>
            <h2 className="text-2xl font-bold">overview</h2>
          </div>
          <div className="flex gap-2 ">
            <AddDataButton />
          </div>
        </div>
      </div>

      <Card className="@container/card w-xs">
        <CardHeader className="relative">
          <CardDescription className="flex gap-1 items-center"> <GitGraph className="size-4" /> current segment</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            segment name
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="text-xs p-2 mt-2 w-ful">
                show rules
              </Button>
            </DialogTrigger>
            <DialogContent>
              ere
            </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>

    </div>
  )
}
