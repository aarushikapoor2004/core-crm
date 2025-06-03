import { db } from "@/db"

// Types for the query structure
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

// SQL operator mapping
const getOperatorSQL = (operator: string, field: string, value: string | number): string => {
  const escapedValue = typeof value === "string" ? `'${value.replace(/'/g, "''")}'` : value

  switch (operator) {
    case "equals":
      return `${field} = ${escapedValue}`
    case "not_equals":
      return `${field} != ${escapedValue}`
    case "contains":
      return `${field} LIKE '%${value}%'`
    case "starts_with":
      return `${field} LIKE '${value}%'`
    case "ends_with":
      return `${field} LIKE '%${value}'`
    case "greater_than":
      return `${field} > ${escapedValue}`
    case "less_than":
      return `${field} < ${escapedValue}`
    case "greater_equal":
      return `${field} >= ${escapedValue}`
    case "less_equal":
      return `${field} <= ${escapedValue}`
    case "before":
      return `${field} < '${value}'`
    case "after":
      return `${field} > '${value}'`
    case "between":
      // For between, you might need to handle this differently based on your needs
      return `${field} = ${escapedValue}`
    default:
      return `${field} = ${escapedValue}`
  }
}

// Convert query group to SQL WHERE clause
const buildWhereClause = (group: QueryGroup): string => {
  if (!group.children || group.children.length === 0) {
    return "1=1" // Return true condition if no children
  }

  const conditions: string[] = []

  for (const child of group.children) {
    if ("type" in child && child.type === "group") {
      // It's a nested group
      const nestedCondition = buildWhereClause(child)
      if (nestedCondition && nestedCondition !== "1=1") {
        conditions.push(`(${nestedCondition})`)
      }
    } else {
      // It's a condition
      const condition = child as QueryCondition
      if (condition.field && condition.operator && condition.value !== "") {
        const sqlCondition = getOperatorSQL(condition.operator, condition.field, condition.value)
        conditions.push(sqlCondition)
      }
    }
  }

  if (conditions.length === 0) {
    return "1=1"
  }

  // Join conditions with the group's logic (AND/OR)
  return conditions.join(` ${group.logic} `)
}

// Main function to process query and return results
export const processQuery = async (rules: QueryGroup, tableName = "users") => {
  try {
    // Build the WHERE clause from the rules
    const whereClause = buildWhereClause(rules)

    // Construct the full SQL query
    const sqlQuery = `SELECT * FROM ${tableName} WHERE ${whereClause}`

    console.log("Generated SQL:", sqlQuery)

    // Execute the query
    const results = await db.execute(sqlQuery)

    return {
      success: true,
      data: results.rows,
      query: sqlQuery,
      count: results.rows.length,
    }
  } catch (error) {
    console.error("Query processing error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      data: [],
      query: "",
      count: 0,
    }
  }
}

