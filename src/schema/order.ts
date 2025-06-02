import { Prisma } from "@prisma/client";
import { z } from "zod";

export const orderSchema = z.object({
  status: z.enum(["confirmed", "pending", "refunded"], { errorMap: () => ({ message: "Class grade is required and must be a valid grade (e.g., 1 to 12, Play, or Nursery).", }) }),
  amount: z.number().min(0, "Amount must be non-negative"),
  orderDate: z.date(),
  customerId: z.string(),
});

export const orderFormSchema = z.object({
  entries: z.array(orderSchema).min(1, "At least one timetable entry is required")
});

export const defaultValues: z.infer<typeof orderFormSchema> = {
  entries: []
};

export type getCoustomerSchema = Prisma.CustomerGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    phoneNumber: true;
    _count: {
      select: {
        orders: true;
      };
    };
  };
}>;

