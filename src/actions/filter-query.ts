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
