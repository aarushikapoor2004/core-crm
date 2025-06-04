'use server'
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { orderFormSchema, orderSchema } from "@/schema/order"
import type { ApiResponse } from "@/types"
import { OrderStatus } from "@prisma/client";

function getStatus(status: string) {
  if (status === "pending") return OrderStatus.PENDING;
  if (status === "confirmed") return OrderStatus.CONFIRMED;
  if (status === "refunded") return OrderStatus.REFUNDED;
}


export async function POST(request: NextRequest) {
  try {
    console.clear();
    console.log("🔵 [START] POST /api/orders");

    // Step 1: Parse JSON Body
    const body = await request.json();
    console.log("📥 Request Body:", body);

    const { userId, entries } = body;

    // Step 2: Check Auth
    if (!userId) {
      console.error("❌ No userId provided. Authentication failed.");
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Unauthorized: User not authenticated",
        },
        { status: 401 }
      );
    }

    console.log("✅ Authenticated User ID:", userId);

    // Step 3: Validate Full Form Data
    const validationResult = orderFormSchema.safeParse({ entries });
    if (!validationResult.success) {
      console.error("❌ Order Form Schema Validation Failed:");
      console.table(validationResult.error.errors);
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Validation failed: Invalid order data format",
        },
        { status: 400 }
      );
    }

    console.log(`📝 ${entries.length} Order Entries to Process`);

    // Step 4: Process Entries
    let uploadedCount = 0;
    let failedCount = 0;
    const failedEntries: Array<{ index: number; error: string }> = [];

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      console.log(`🔄 Processing Entry ${i + 1}:`, entry);

      try {
        // 4a. Validate individual entry
        const validEntry = orderSchema.parse(entry);
        console.log(`✅ Entry ${i + 1} Passed Schema Validation`);

        // 4b. Verify customer exists
        const customer = await db.customer.findUnique({
          where: { id: validEntry.customerId },
        });

        if (!customer) {
          throw new Error(
            `Customer with ID '${validEntry.customerId}' not found`
          );
        }
        console.log(`👤 Customer Found: ${customer.name} (${customer.id})`);

        // 4c. Create the order
        const createdOrder = await db.order.create({
          data: {
            status: getStatus(validEntry.status),
            amount: validEntry.amount,
            customerId: validEntry.customerId,
          },
        });

        console.log(`✅ Order Created (ID: ${createdOrder.id})`);
        uploadedCount++;
      } catch (error) {
        console.error(`❌ Failed Entry ${i + 1}:`, error);

        failedCount++;
        failedEntries.push({
          index: i + 1,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Step 5: Summary
    console.log("📊 Upload Summary:");
    console.log(`✅ Uploaded: ${uploadedCount}`);
    console.log(`❌ Failed: ${failedCount}`);
    if (failedCount > 0) {
      console.table(failedEntries);
    }

    let message = `Processing completed: ${uploadedCount} orders uploaded successfully.`;
    if (failedCount > 0) {
      message += ` ${failedCount} entries failed.`;
    }

    return NextResponse.json<ApiResponse<{ uploaded: number; failed: number }>>(
      {
        success: true,
        message,
        data: {
          uploaded: uploadedCount,
          failed: failedCount,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 Uncaught Exception in POST /api/orders");

    if (error instanceof Error) {
      console.error("🛑 Error Details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Internal server error occurred while processing orders.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  console.log("GET request received - Method not allowed")
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      message: "Method not allowed. Use POST to create orders.",
    },
    { status: 405 },
  )
}

export async function PUT() {
  console.log("PUT request received - Method not allowed")
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      message: "Method not allowed. Use POST to create orders.",
    },
    { status: 405 },
  )
}

export async function DELETE() {
  console.log("DELETE request received - Method not allowed")
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      message: "Method not allowed. Use POST to create orders.",
    },
    { status: 405 },
  )
}

