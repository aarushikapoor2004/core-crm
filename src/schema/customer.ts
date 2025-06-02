import { Prisma } from "@prisma/client";
import { z } from "zod";

export const customerSchema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().nonempty("Name is required"),
  phoneNumber: z.string().nonempty("Phone number is required"),
  age: z.number().int().min(0, "Age must be a positive integer"),
});


export const customerFormSchema = z.object({
  entries: z.array(customerSchema).min(1, "At least one timetable entry is required")
});

export const defaultValues: z.infer<typeof customerFormSchema> = {
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

