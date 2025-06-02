"use client"

import { useState, useCallback } from "react"
import QueryBuilder from "@/components/query-builder"

// Example fields configuration
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

// Example default query
const defaultQuery = {
  logic: "AND" as const,
  conditions: [
    {
      id: "1",
      field: "status",
      operator: "equals",
      value: "Active",
    },
    {
      id: "2",
      field: "department",
      operator: "equals",
      value: "Engineering",
    },
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
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Query Builder Demo</h1>
          <p className="text-muted-foreground">Build dynamic queries with multiple conditions using AND/OR logic</p>
        </div>

        <QueryBuilder fields={exampleFields} defaultQuery={defaultQuery} onQueryChange={handleQueryChange} />

        {/* Display current query state */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Current Query State</h2>
          <div className="bg-muted p-4 rounded-md">
            <pre className="text-sm overflow-x-auto">{JSON.stringify(currentQuery, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}

