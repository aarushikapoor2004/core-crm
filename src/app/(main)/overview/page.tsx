import { AddDataButton } from "@/components/add-data-button";
import { TrendingUpIcon, User, ShoppingCart, Tags } from "lucide-react";
import { db } from "@/db";
import { redirect } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { OverviewTable } from "@/components/overview-table";
import { auth } from "@/lib/auth";

export default async function MainHomePage() {
  const session = await auth();
  if (session == null) {
    redirect('/login');
  }
  const userId = session.user.id;
  if (!userId) {
    redirect('/');
  }

  const [customerData, totalOrders, totalSegments, previousMonthOrders] = await Promise.all([
    db.customer.findMany({
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
      where: {
        userId: userId
      }
    }),
    db.order.count({
      where: {
        customer: {
          userId: userId
        }
      }
    }),
    db.segment.count({
      where: {
        userId: userId
      }
    }),
    db.order.count({
      where: {
        customer: {
          userId: userId
        },
        orderDate: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    })
  ]);

  const currentMonthOrders = await db.order.count({
    where: {
      customer: {
        userId: userId
      },
      orderDate: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    }
  });

  const growthRate = previousMonthOrders > 0
    ? ((currentMonthOrders - previousMonthOrders) / previousMonthOrders * 100)
    : currentMonthOrders > 0 ? 100 : 0;

  const totalCustomers = customerData.length;

  return (
    <div className="space-y-3">
      <div className="w-full">
        <div className="flex justify-between pt-2">
          <div>
            <h2 className="text-2xl font-bold">overview</h2>
          </div>
          <div className="flex gap-2 ">
            <AddDataButton />
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-4 overflow-x-auto *:data-[slot=card]:shadow-xs *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
        <Card className="@container/card w-full">
          <CardHeader className="relative">
            <CardDescription className="flex gap-2 items-center">
              <User className="size-4" /> Total Customers
            </CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {totalCustomers.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="@container/card w-full">
          <CardHeader className="relative">
            <CardDescription className="flex gap-2 items-center">
              <ShoppingCart className="size-4" /> Total Orders
            </CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {totalOrders.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="@container/card w-full">
          <CardHeader className="relative">
            <CardDescription className="flex gap-2 items-center">
              <Tags className="size-4" /> Total Segments
            </CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {totalSegments.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="@container/card w-full">
          <CardHeader className="relative">
            <CardDescription>Growth Rate</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}%
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge
                variant="outline"
                className={`flex gap-1 rounded-lg text-xs ${growthRate >= 0 ? 'text-green-600 border-green-200' : 'text-red-600 border-red-200'
                  }`}
              >
                <TrendingUpIcon className={`size-3 ${growthRate < 0 ? 'rotate-180' : ''}`} />
                {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}%
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {growthRate >= 0 ? 'Positive growth' : 'Declining trend'}
              <TrendingUpIcon className={`size-4 ${growthRate < 0 ? 'rotate-180' : ''}`} />
            </div>
            <div className="text-muted-foreground">
              {growthRate >= 0 ? 'Orders increasing' : 'Orders decreasing'} vs last month
            </div>
          </CardFooter>
        </Card>
      </div>
      <OverviewTable data={customerData} />
    </div>
  );
}
