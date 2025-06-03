"use server";

import { Prisma } from "@prisma/client";
import { db } from "@/db";

type GetAllSegmentsType = Prisma.SegmentGetPayload<{
  select: {
    id: true;
    name: true;
    rules: true;
  };
}>;

export async function getAllSegmentsById(userId: string): Promise<GetAllSegmentsType[]> {
  try {
    const segments = await db.segment.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        rules: true,
      },
    });

    return segments;
  } catch (error) {
    console.error("Failed to fetch segments:", error);
    return [];
  }
}

