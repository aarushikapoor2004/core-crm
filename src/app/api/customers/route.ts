import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { customerFormSchema, customerSchema } from "@/schema/customer";
import type { ApiResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    console.clear();
    const body = await request.json();
    console.log("Received request body:", body);

    // Check if userId is provided from frontend
    const { userId, entries } = body;

    if (!userId) {
      console.error("Authentication error: No userId provided in request");
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Unauthorized: User not authenticated",
        },
        { status: 401 }
      );
    }

    console.log("Processing request for userId:", userId);

    // Validate the form data structure
    const validationResult = customerFormSchema.safeParse({ entries });
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error.errors);
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Validation failed: Invalid customer data format",
        },
        { status: 400 }
      );
    }

    console.log(`Starting to process ${entries.length} customer entries`);

    let uploadedCount = 0;
    let failedCount = 0;
    const failedEntries: Array<{ index: number; error: string }> = [];

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      try {
        console.log(`Processing entry ${i + 1}:`, entry);

        // Validate individual entry
        const validEntry = customerSchema.parse(entry);
        console.log(`Entry ${i + 1} validation passed`);

        // Create customer in database
        const createdCustomer = await db.customer.create({
          data: {
            name: validEntry.name,
            email: validEntry.email,
            phoneNumber: validEntry.phoneNumber,
            age: validEntry.age as number,
            userId: userId,
          },
        });

        console.log(`Entry ${i + 1} successfully created with ID:`, createdCustomer.id);
        uploadedCount++;

      } catch (error) {
        console.error(`Failed to process entry ${i + 1}:`, error);

        let errorMessage = "Unknown error";
        if (error instanceof Error) {
          errorMessage = error.message;
        }

        failedEntries.push({
          index: i + 1,
          error: errorMessage
        });

        failedCount++;
      }
    }

    // Log summary
    console.log(`Processing completed: ${uploadedCount} successful, ${failedCount} failed`);
    if (failedEntries.length > 0) {
      console.log("Failed entries details:", failedEntries);
    }

    let message = `Processing completed: ${uploadedCount} customers uploaded successfully.`;
    if (failedCount > 0) {
      message += ` ${failedCount} entries failed.`;
    }

    return NextResponse.json<ApiResponse<{ uploaded: number; failed: number }>>(
      {
        success: true,
        message,
        data: {
          uploaded: uploadedCount,
          failed: failedCount
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Customer API Error:", error);

    let errorMessage = "Internal server error occurred while processing customers.";
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      errorMessage = error.message;
    }

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  console.log("GET request received - Method not allowed");
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      message: "Method not allowed. Use POST to create customers.",
    },
    { status: 405 }
  );
}

export async function PUT() {
  console.log("PUT request received - Method not allowed");
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      message: "Method not allowed. Use POST to create customers.",
    },
    { status: 405 }
  );
}

export async function DELETE() {
  console.log("DELETE request received - Method not allowed");
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      message: "Method not allowed. Use POST to create customers.",
    },
    { status: 405 }
  );
}
