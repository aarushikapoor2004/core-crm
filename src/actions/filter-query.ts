'use server'

import { db } from '@/db'
import { auth } from '@/lib/auth'

export async function getAllData() {
  try {
    const session = await auth();

    const userId = session?.user?.id; // Safely access user ID

    if (userId) {
      const data = await db.customer.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          _count: {
            select: {
              orders: true
            }
          }
        },
        where: { userId }
      });

      console.clear();
      console.log(data);
      const shuffled = data.sort(() => 0.5 - Math.random());
      const sample = shuffled.slice(0, 5);
      return sample;
    }

    return [];
  } catch (error) {
    console.error("Error in getAllData:", error);
    return [];
  }
}

//@ts-ignore
export async function filterCustomersAction(queryObject, userId) {
  try {
    // Step 1: Fetch all customers for the user
    const allCustomers = await db.customer.findMany({
      where: { userId }, // Assuming customers belong to users
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        age: true,
      }
    })

    //@ts-ignore
    const filteredCustomers = allCustomers.filter(customer =>
      evaluateQuery(queryObject, customer)
    )

    return {
      success: true,
      data: filteredCustomers,
      total: filteredCustomers.length,
      originalTotal: allCustomers.length
    }

  } catch (error) {
    console.error('Filter customers error:', error)

    // Return empty array if something fails
    return {
      success: false,
      //@ts-ignore
      error: error.message,
      data: [],
      total: 0,
      originalTotal: 0
    }
  }
}

// Helper function to evaluate the query against a customer record
//@ts-ignore
function evaluateQuery(query, customer) {
  try {
    if (query.type === 'group') {
      // Handle group logic (AND/OR)
      if (query.logic === 'AND') {
        //@ts-ignore
        return query.children.every(child => evaluateQuery(child, customer))
      } else if (query.logic === 'OR') {
        //@ts-ignore
        return query.children.some(child => evaluateQuery(child, customer))
      }
    } else {
      // Handle individual field conditions
      return evaluateCondition(query, customer)
    }
  } catch (error) {
    console.error('Query evaluation error:', error)
    // If evaluation fails, include the customer (fail-safe)
    return true
  }
}

// Helper function to evaluate individual conditions
//@ts-ignore
function evaluateCondition(condition, customer) {
  const { field, operator, value } = condition

  // Get the customer field value directly (assuming field names match your DB)
  const customerValue = customer[field]

  // Handle null/undefined values safely
  if (customerValue === null || customerValue === undefined) {
    return false
  }

  try {
    switch (operator) {
      // Text operators
      case 'equals':
        return String(customerValue).toLowerCase() === String(value).toLowerCase()

      case 'not_equals':
        return String(customerValue).toLowerCase() !== String(value).toLowerCase()

      case 'contains':
        return String(customerValue).toLowerCase().includes(String(value).toLowerCase())

      case 'starts_with':
        return String(customerValue).toLowerCase().startsWith(String(value).toLowerCase())

      case 'ends_with':
        return String(customerValue).toLowerCase().endsWith(String(value).toLowerCase())

      // Number operators
      case 'greater_than':
        return Number(customerValue) > Number(value)

      case 'less_than':
        return Number(customerValue) < Number(value)

      case 'greater_equal':
        return Number(customerValue) >= Number(value)

      case 'less_equal':
        return Number(customerValue) <= Number(value)

      // Date operators
      case 'before':
        return new Date(customerValue) < new Date(value)

      case 'after':
        return new Date(customerValue) > new Date(value)

      case 'between':
        // Expecting value to be an array [startDate, endDate] or comma-separated string
        const dates = Array.isArray(value) ? value : String(value).split(',')
        if (dates.length === 2) {
          const customerDate = new Date(customerValue)
          return customerDate >= new Date(dates[0]) && customerDate <= new Date(dates[1])
        }
        return false

      default:
        console.warn(`Unknown operator: ${operator}`)
        return true // Fail-safe: include the record
    }
  } catch (error) {
    console.error(`Error evaluating condition for field ${field} with operator ${operator}:`, error)
    return true // Fail-safe: include the record
  }
}

// Alternative version if you want to fetch the segment from DB first
//@ts-ignore
export async function filterCustomersBySegmentId(segmentId, userId) {
  try {
    // Fetch the segment query from database
    const segment = await db.segment.findFirst({
      where: { id: segmentId, userId }
    })

    if (!segment) {
      return {
        success: false,
        error: 'Segment not found',
        data: [],
        total: 0
      }
    }

    // Parse the query if it's stored as JSON string
    // @ts-ignore
    const queryObject = typeof segment.query === 'string'
      // @ts-ignore
      ? JSON.parse(segment.query)
      // @ts-ignore
      : segment.query

    // Use the main filter function
    return await filterCustomersAction(queryObject, userId)

  } catch (error) {
    console.error('Filter by segment error:', error)
    return {
      success: false,
      //@ts-ignore
      error: error.message,
      data: [],
      total: 0
    }
  }
}
