import { Prisma } from "@prisma/client";

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

