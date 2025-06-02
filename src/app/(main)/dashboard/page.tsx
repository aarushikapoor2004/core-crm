"use client";

import { AddDataButton } from "@/components/add-data-button";
import { TrendingDownIcon, TrendingUpIcon, User } from "lucide-react"

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function MainHomePage() {
  return (
    <div>
      <div className="flex gap-2">
        <div className="w-full">
          <div className="flex justify-between pr-4 pt-1">
            <div>
              <h2 className="text-2xl font-bold">overview</h2>
            </div>
            <div className="flex gap-2 ">
              <AddDataButton />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-4  pr-3 mt-2   overflow-x-auto *:data-[slot=card]:shadow-xs *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
        <Card className="@container/card w-full">
          <CardHeader className="relative">
            <CardDescription className="flex gap-2 items-center"> <User /> Total Coustomers  </CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              total number of Coustomers
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="@container/card w-full">
          <CardHeader className="relative">
            <CardDescription className="flex gap-2 items-center"> <User /> Total Coustomers  </CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              total number of Orders
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="@container/card w-full">
          <CardHeader className="relative">
            <CardDescription className="flex gap-2 items-center"> <User /> Total Coustomers  </CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              total number of Segments
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="@container/card w-full">
          <CardHeader className="relative">
            <CardDescription>Growth Rate</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              4.5%
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                <TrendingUpIcon className="size-3" />
                +4.5%
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Steady performance <TrendingUpIcon className="size-4" />
            </div>
            <div className="text-muted-foreground">Meets growth projections</div>
          </CardFooter>
        </Card>
      </div>
      table


    </div>
  )
}
