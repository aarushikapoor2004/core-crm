import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { customerFormSchema, customerSchema } from "@/schema/customer";
import { auth } from "@/lib/auth";
import type { ApiResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Unauthorized: User not authenticated",
        },
        { status: 400 }
      );
    }

    const validationResult = customerFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Validation failed: Invalid customer data format",
        },
        { status: 400 }
      );
    }

    const { entries } = validationResult.data;
    let uploadedCount = 0;
    let failedCount = 0;

    for (const entry of entries) {
      try {
        const validEntry = customerSchema.parse(entry);
        await db.customer.create({
          data: {
            name: validEntry.name,
            email: validEntry.email,
            phoneNumber: validEntry.phoneNumber,
            age: validEntry.age,
            userId: userId,
          },
        });
        uploadedCount++;
      } catch (error) {
        failedCount++;
      }
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
          failed: failedCount,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Customer API Error:", error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Internal server error occurred while processing customers.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      message: "Method not allowed. Use POST to create customers.",
    },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      message: "Method not allowed. Use POST to create customers.",
    },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      message: "Method not allowed. Use POST to create customers.",
    },
    { status: 405 }
  );
}

