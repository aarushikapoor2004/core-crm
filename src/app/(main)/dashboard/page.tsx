"use client";

import { AddDataButton } from "@/components/add-data-button";

export default function MainHomePage() {
  return (
    <div>
      <div className="flex gap-2">
        <div className="w-full">
          <div className="flex justify-between pr-4 pt-1">
            <div>
              <h2 className="text-2xl font-bold">Courses</h2>
            </div>
            <div className="flex gap-2 ">
              <AddDataButton />
            </div>
          </div>
        </div>
      </div>
      hi
    </div>
  )
}
