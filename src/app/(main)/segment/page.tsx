"use client"

import { useState, useCallback } from "react"
import QueryBuilder from "@/components/query-builder"

const exampleFields = [
  {
    name: "name",
    label: "Full Name",
    type: "text" as const,
  },
  {
    name: "age",
    label: "Age",
    type: "number" as const,
  },
  {
    name: "email",
    label: "Email Address",
    type: "text" as const,
  },
  {
    name: "registration_date",
    label: "Registration Date",
    type: "date" as const,
  },
  {
    name: "status",
    label: "Account Status",
    type: "select" as const,
    options: ["Active", "Inactive", "Pending", "Suspended"],
  },
  {
    name: "department",
    label: "Department",
    type: "select" as const,
    options: ["Engineering", "Marketing", "Sales", "HR", "Finance"],
  },
]

const defaultQuery = {
  id: "root",
  type: "group" as const,
  logic: "OR" as const,
  children: [
  ],
}

export default function Home() {
  const [currentQuery, setCurrentQuery] = useState<any>(defaultQuery)

  const handleQueryChange = useCallback((query: any) => {
    setCurrentQuery(query)
    console.log("Query changed:", query)
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <QueryBuilder fields={exampleFields} defaultQuery={defaultQuery} onQueryChange={handleQueryChange} />
    </div >
  )
}

