"use server";

import { segmentSchema } from "@/schema/segment";
import { z } from "zod";
import { db } from "@/db";
import { ApiResponse } from "@/types";

export async function createSegment(values: z.infer<typeof segmentSchema>): Promise<ApiResponse> {
  try {
    const parsed = segmentSchema.safeParse(values);

    if (!parsed.success) {
      return {
        success: false,
        message: "Error while parsing segment data",
      };
    }

    const { name, userId, rules } = parsed.data;
    if (rules == null) {
      return {
        success: false,
        message: "there are no rules",
      };
    }

    await db.segment.create({
      data: {
        name,
        userId,
        rules,
      },
    });

    return {
      success: true,
      message: "Segment created successfully",
    };
  } catch (error) {
    console.error("Segment creation failed:", error);
    return {
      success: false,
      message: "An error occurred while creating the segment",
    };
  }
}

