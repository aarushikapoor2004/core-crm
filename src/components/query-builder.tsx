"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus } from "lucide-react"

interface Field {
  name: string
  label: string
  type: "text" | "number" | "date" | "select"
  options?: string[]
}

interface QueryCondition {
  id: string
  field: string
  operator: string
  value: string | number
}

interface QueryBuilderProps {
  fields: Field[]
  defaultQuery?: QueryCondition[]
  onQueryChange: (query: QueryCondition[]) => void
}

const getOperatorsForType = (type: string) => {
  switch (type) {
    case "text":
      return [
        { value: "equals", label: "Equals" },
        { value: "contains", label: "Contains" },
        { value: "starts_with", label: "Starts with" },
        { value: "ends_with", label: "Ends with" },
        { value: "not_equals", label: "Not equals" },
      ]
    case "number":
      return [
        { value: "equals", label: "Equals" },
        { value: "greater_than", label: "Greater than" },
        { value: "less_than", label: "Less than" },
        { value: "greater_equal", label: "Greater or equal" },
        { value: "less_equal", label: "Less or equal" },
        { value: "not_equals", label: "Not equals" },
      ]
    case "date":
      return [
        { value: "equals", label: "Equals" },
        { value: "before", label: "Before" },
        { value: "after", label: "After" },
        { value: "between", label: "Between" },
      ]
    case "select":
      return [
        { value: "equals", label: "Equals" },
        { value: "not_equals", label: "Not equals" },
      ]
    default:
      return [{ value: "equals", label: "Equals" }]
  }
}

export default function QueryBuilder({ fields, defaultQuery = [], onQueryChange }: QueryBuilderProps) {
  // State to manage all query conditions
  const [conditions, setConditions] = useState<QueryCondition[]>(defaultQuery)

  // Effect to call onQueryChange whenever conditions change
  useEffect(() => {
    onQueryChange(conditions)
  }, [conditions, onQueryChange])

  // Function to add a new condition
  const addCondition = () => {
    const newCondition: QueryCondition = {
      id: Date.now().toString(), // Simple ID generation
      field: fields[0]?.name || "",
      operator: "equals",
      value: "",
    }
    setConditions([...conditions, newCondition])
  }

  // Function to remove a condition
  const removeCondition = (id: string) => {
    setConditions(conditions.filter((condition) => condition.id !== id))
  }

  // Function to update a specific condition
  const updateCondition = (id: string, updates: Partial<QueryCondition>) => {
    setConditions(conditions.map((condition) => (condition.id === id ? { ...condition, ...updates } : condition)))
  }

  // Function to get field object by name
  const getFieldByName = (name: string) => {
    return fields.find((field) => field.name === name)
  }

  // Function to render value input based on field type
  const renderValueInput = (condition: QueryCondition) => {
    const field = getFieldByName(condition.field)
    if (!field) return null

    switch (field.type) {
      case "text":
        return (
          <Input
            type="text"
            value={condition.value}
            onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
            placeholder="Enter value"
          />
        )
      case "number":
        return (
          <Input
            type="number"
            value={condition.value}
            onChange={(e) => updateCondition(condition.id, { value: Number(e.target.value) })}
            placeholder="Enter number"
          />
        )
      case "date":
        return (
          <Input
            type="date"
            value={condition.value}
            onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
          />
        )
      case "select":
        return (
          <Select
            value={condition.value.toString()}
            onValueChange={(value) => updateCondition(condition.id, { value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select value" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Query Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Render each condition */}
        {conditions.map((condition) => {
          const field = getFieldByName(condition.field)
          const operators = field ? getOperatorsForType(field.type) : []

          return (
            <div key={condition.id} className="flex items-end gap-4 p-4 border rounded-lg">
              {/* Field Selection */}
              <div className="flex-1">
                <Label htmlFor={`field-${condition.id}`}>Field</Label>
                <Select
                  value={condition.field}
                  onValueChange={(value) => {
                    // Reset operator and value when field changes
                    const newField = getFieldByName(value)
                    const defaultOperator = newField ? getOperatorsForType(newField.type)[0].value : "equals"
                    updateCondition(condition.id, {
                      field: value,
                      operator: defaultOperator,
                      value: "",
                    })
                  }}
                >
                  <SelectTrigger id={`field-${condition.id}`}>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map((field) => (
                      <SelectItem key={field.name} value={field.name}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Label htmlFor={`operator-${condition.id}`}>Operator</Label>
                <Select
                  value={condition.operator}
                  onValueChange={(value) => updateCondition(condition.id, { operator: value })}
                >
                  <SelectTrigger id={`operator-${condition.id}`}>
                    <SelectValue placeholder="Select operator" />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map((operator) => (
                      <SelectItem key={operator.value} value={operator.value}>
                        {operator.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Value Input */}
              <div className="flex-1">
                <Label htmlFor={`value-${condition.id}`}>Value</Label>
                {renderValueInput(condition)}
              </div>

              {/* Remove Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => removeCondition(condition.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )
        })}

        {/* Add Condition Button */}
        <Button onClick={addCondition} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Condition
        </Button>

        {/* Query Preview */}
        {conditions.length > 0 && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <Label className="text-sm font-medium">Current Query (JSON):</Label>
            <pre className="mt-2 text-sm overflow-x-auto">{JSON.stringify(conditions, null, 2)}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

