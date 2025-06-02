"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ColumnDef, Table } from "@tanstack/react-table"

interface DataTableSearchProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  table: Table<TData>
}

export function DataTableSearch<TData, TValue>({
  columns,
  table,
}: DataTableSearchProps<TData, TValue>) {
  const [selectedColumn, setSelectedColumn] = React.useState<string>("")

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    if (selectedColumn) {
      table.getColumn(selectedColumn)?.setFilterValue(value)
    }
  }

  // Handle column change
  const handleColumnChange = (value: string) => {
    // Clear the previous column's filter when changing columns
    if (selectedColumn) {
      table.getColumn(selectedColumn)?.setFilterValue("")
    }
    setSelectedColumn(value)
  }

  return (
    <div className="flex items-center space-x-4">
      <Select onValueChange={handleColumnChange} value={selectedColumn}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select column to search" />
        </SelectTrigger>
        <SelectContent>
          {columns.map((column) => {
            // Only show columns that can be filtered
            if (!column.id || !column.enableColumnFilter) return null

            return (
              <SelectItem key={column.id} value={column.id}>
                {typeof column.header === "function"
                  ? column.header(column as any)
                  : (column.header as string) || column.id}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>

      <Input
        placeholder={`Search ${selectedColumn ? `by ${selectedColumn}` : ''}...`}
        onChange={handleSearchChange}
        className="max-w-sm"
        disabled={!selectedColumn}
      />
    </div>
  )
}


