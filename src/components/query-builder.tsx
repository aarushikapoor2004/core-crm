"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Define the types for our component
interface Field {
  name: string
  label: string
  type: "text" | "number" | "date" | "select"
  options?: string[] // For select fields
}

interface QueryCondition {
  id: string
  field: string
  operator: string
  value: string | number
}

interface QueryGroup {
  id: string
  logic: "AND" | "OR"
  conditions: QueryCondition[]
}

interface QueryBuilderProps {
  fields: Field[]
  defaultQuery?: {
    logic: "AND" | "OR"
    conditions: QueryCondition[]
  }
  onQueryChange: (query: { logic: "AND" | "OR"; conditions: QueryCondition[] }) => void
}

// Define operators based on field types
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

export default function QueryBuilder({ fields, defaultQuery, onQueryChange }: QueryBuilderProps) {
  // State to manage all query conditions and logic
  const [logic, setLogic] = useState<"AND" | "OR">(defaultQuery?.logic || "AND")
  const [conditions, setConditions] = useState<QueryCondition[]>(defaultQuery?.conditions || [])

  // Memoize the query object to prevent unnecessary re-renders
  const currentQuery = useCallback(() => ({ logic, conditions }), [logic, conditions])

  // Effect to call onQueryChange whenever conditions or logic change
  useEffect(() => {
    onQueryChange(currentQuery())
  }, [currentQuery, onQueryChange])

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
        {/* Logic Selector */}
        <div className="bg-muted p-4 rounded-lg">
          <Label className="mb-2 block">Match conditions when:</Label>
          <RadioGroup
            value={logic}
            onValueChange={(value) => setLogic(value as "AND" | "OR")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="AND" id="and" />
              <Label htmlFor="and" className="font-medium">
                ALL conditions are met (AND)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="OR" id="or" />
              <Label htmlFor="or" className="font-medium">
                ANY condition is met (OR)
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Render each condition */}
        {conditions.map((condition, index) => {
          const field = getFieldByName(condition.field)
          const operators = field ? getOperatorsForType(field.type) : []

          return (
            <div key={condition.id} className="space-y-4">
              {/* Logic connector between conditions */}
              {index > 0 && (
                <div className="flex items-center justify-center">
                  <div className="bg-muted px-4 py-1 rounded-full text-sm font-medium">{logic}</div>
                </div>
              )}

              <div className="flex items-end gap-4 p-4 border rounded-lg">
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

                {/* Operator Selection */}
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
                  disabled={conditions.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
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
            <pre className="mt-2 text-sm overflow-x-auto">{JSON.stringify({ logic, conditions }, null, 2)}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
