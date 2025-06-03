"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, FolderPlus } from "lucide-react"
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
  type: "group"
  logic: "AND" | "OR"
  children: (QueryCondition | QueryGroup)[]
}

interface QueryBuilderProps {
  fields: Field[]
  defaultQuery?: QueryGroup
  onQueryChange: (query: QueryGroup) => void
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
  // Default query structure
  const createDefaultQuery = (): QueryGroup => ({
    id: "root",
    type: "group",
    logic: "AND",
    children: [],
  })

  // State to manage the root query group
  const [rootQuery, setRootQuery] = useState<QueryGroup>(defaultQuery || createDefaultQuery())

  // Memoize the query object to prevent unnecessary re-renders
  const currentQuery = useCallback(() => rootQuery, [rootQuery])

  // Effect to call onQueryChange whenever the query changes
  useEffect(() => {
    onQueryChange(currentQuery())
  }, [currentQuery, onQueryChange])

  // Function to find a group by ID in the query tree
  const findGroupById = (query: QueryGroup, targetId: string): QueryGroup | null => {
    if (query.id === targetId) return query

    for (const child of query.children) {
      // Check if child is a group by checking if it has the 'type' property
      if ('type' in child && child.type === "group") {
        const found = findGroupById(child, targetId)
        if (found) return found
      }
    }
    return null
  }

  // Function to update the query tree
  const updateQuery = (updater: (query: QueryGroup) => QueryGroup) => {
    setRootQuery(updater(rootQuery))
  }

  // Function to add a new condition to a group
  const addCondition = (groupId: string) => {
    const newCondition: QueryCondition = {
      id: Date.now().toString(),
      field: fields[0]?.name || "",
      operator: "equals",
      value: "",
    }

    updateQuery((query) => {
      const group = findGroupById(query, groupId)
      if (group) {
        group.children.push(newCondition)
      }
      return { ...query }
    })
  }

  // Function to add a new group
  const addGroup = (parentGroupId: string) => {
    const newGroup: QueryGroup = {
      id: Date.now().toString(),
      type: "group",
      logic: "AND",
      children: [],
    }

    updateQuery((query) => {
      const parentGroup = findGroupById(query, parentGroupId)
      if (parentGroup) {
        parentGroup.children.push(newGroup)
      }
      return { ...query }
    })
  }

  // Function to remove an item (condition or group)
  const removeItem = (parentGroupId: string, itemId: string) => {
    updateQuery((query) => {
      const parentGroup = findGroupById(query, parentGroupId)
      if (parentGroup) {
        parentGroup.children = parentGroup.children.filter((child) => child.id !== itemId)
      }
      return { ...query }
    })
  }

  // Function to update a condition
  const updateCondition = (groupId: string, conditionId: string, updates: Partial<QueryCondition>) => {
    updateQuery((query) => {
      const group = findGroupById(query, groupId)
      if (group) {
        const condition = group.children.find(
          (child) => child.id === conditionId && !('type' in child),
        ) as QueryCondition
        if (condition) {
          Object.assign(condition, updates)
        }
      }
      return { ...query }
    })
  }

  // Function to update group logic
  const updateGroupLogic = (groupId: string, logic: "AND" | "OR") => {
    updateQuery((query) => {
      const group = findGroupById(query, groupId)
      if (group) {
        group.logic = logic
      }
      return { ...query }
    })
  }

  // Function to get field object by name
  const getFieldByName = (name: string) => {
    return fields.find((field) => field.name === name)
  }

  // Function to render value input based on field type
  const renderValueInput = (condition: QueryCondition, groupId: string) => {
    const field = getFieldByName(condition.field)
    if (!field) return null

    switch (field.type) {
      case "text":
        return (
          <Input
            type="text"
            value={condition.value}
            onChange={(e) => updateCondition(groupId, condition.id, { value: e.target.value })}
            placeholder="Enter value"
          />
        )
      case "number":
        return (
          <Input
            type="number"
            value={condition.value}
            onChange={(e) => updateCondition(groupId, condition.id, { value: Number(e.target.value) })}
            placeholder="Enter number"
          />
        )
      case "date":
        return (
          <Input
            type="date"
            value={condition.value}
            onChange={(e) => updateCondition(groupId, condition.id, { value: e.target.value })}
          />
        )
      case "select":
        return (
          <Select
            value={condition.value.toString()}
            onValueChange={(value) => updateCondition(groupId, condition.id, { value })}
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

  // Function to render a condition
  const renderCondition = (condition: QueryCondition, groupId: string, index: number, groupLogic: "AND" | "OR") => {
    const field = getFieldByName(condition.field)
    const operators = field ? getOperatorsForType(field.type) : []

    return (
      <div key={condition.id} className="space-y-2">
        {/* Logic connector between conditions */}
        {index > 0 && (
          <div className="flex items-center justify-center">
            <div className="bg-muted px-3 py-1 rounded-full text-xs font-medium">{groupLogic}</div>
          </div>
        )}

        <div className="flex items-end gap-3 p-3 border rounded-lg bg-accent/50">
          {/* Field Selection */}
          <div className="flex-1">
            <Label htmlFor={`field-${condition.id}`} className="text-xs mb-1">
              Field
            </Label>
            <Select
              value={condition.field}
              onValueChange={(value) => {
                const newField = getFieldByName(value)
                const defaultOperator = newField ? getOperatorsForType(newField.type)[0].value : "equals"
                updateCondition(groupId, condition.id, {
                  field: value,
                  operator: defaultOperator,
                  value: "",
                })
              }}
            >
              <SelectTrigger id={`field-${condition.id}`} className="h-8">
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
            <Label htmlFor={`operator-${condition.id}`} className="text-xs mb-1">
              Operator
            </Label>
            <Select
              value={condition.operator}
              onValueChange={(value) => updateCondition(groupId, condition.id, { operator: value })}
            >
              <SelectTrigger id={`operator-${condition.id}`} className="h-8">
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
            <Label htmlFor={`value-${condition.id}`} className="text-xs mb-1">
              Value
            </Label>
            <div className="h-8">{renderValueInput(condition, groupId)}</div>
          </div>

          {/* Remove Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => removeItem(groupId, condition.id)}
            className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  // Function to render a group
  const renderGroup = (group: QueryGroup, parentGroupId?: string, index?: number, parentLogic?: "AND" | "OR") => {
    const isRoot = group.id === "root"

    return (
      <div key={group.id} className="space-y-3">
        {/* Logic connector between groups */}
        {!isRoot && index !== undefined && index > 0 && parentLogic && (
          <div className="flex items-center justify-center">
            <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
              {parentLogic}
            </div>
          </div>
        )}

        <div className={`border rounded-lg p-4 space-y-4 ${isRoot ? "border-2 border-r-accent" : "border-dashed"}`}>
          {/* Group Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium">{isRoot ? "Main Query" : "Group"} - Match when:</Label>
              <RadioGroup
                value={group.logic}
                onValueChange={(value) => updateGroupLogic(group.id, value as "AND" | "OR")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="AND" id={`and-${group.id}`} />
                  <Label htmlFor={`and-${group.id}`} className="text-sm">
                    ALL (AND)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="OR" id={`or-${group.id}`} />
                  <Label htmlFor={`or-${group.id}`} className="text-sm">
                    ANY (OR)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Remove Group Button (only for non-root groups) */}
            {!isRoot && parentGroupId && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeItem(parentGroupId, group.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Group Content */}
          <div className="space-y-3">
            {group.children.map((child, childIndex) => {
              if ('type' in child && child.type === "group") {
                return renderGroup(child, group.id, childIndex, group.logic)
              } else {
                return renderCondition(child as QueryCondition, group.id, childIndex, group.logic)
              }
            })}
          </div>

          {/* Add Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              onClick={() => addCondition(group.id)}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Condition
            </Button>
            <Button
              type="button"
              onClick={() => addGroup(group.id)}
              variant="outline"
              size="sm"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              Add Group
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-6xl">
      <CardContent className="">
        {renderGroup(rootQuery)}

        {/* Query Preview */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <Label className="text-sm font-medium">Current Query (JSON):</Label>
          <pre className="mt-2 text-xs overflow-x-auto max-h-96 overflow-y-auto">
            {JSON.stringify(rootQuery, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}
