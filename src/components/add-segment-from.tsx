"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardContent, Card, CardHeader, CardDescription } from "./ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { useSession } from "next-auth/react";
import { CirclePlus, Loader2 } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { segmentSchema, defaultValues } from "@/schema/segment";
import QueryBuilder from "./query-builder";

const defaultQuery = {
  id: "root",
  type: "group" as const,
  logic: "OR" as const,
  children: []
}

const exampleFields = [
  {
    name: "name",
    label: "Full Name",
    type: "text" as const,
  },
  {
    name: "age",
    label: "Age",
    type: "number" as const,
  },
  {
    name: "email",
    label: "Email Address",
    type: "text" as const,
  },
  {
    name: "registration_date",
    label: "Registration Date",
    type: "date" as const,
  },
  {
    name: "status",
    label: "Account Status",
    type: "select" as const,
    options: ["Active", "Inactive", "Pending", "Suspended"],
  },
  {
    name: "department",
    label: "Department",
    type: "select" as const,
    options: ["Engineering", "Marketing", "Sales", "HR", "Finance"],
  },
]


export function SegmentForm() {
  const { data: session, status } = useSession();

  const form = useForm<z.infer<typeof segmentSchema>>({
    resolver: zodResolver(segmentSchema),
    defaultValues,
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: z.infer<typeof segmentSchema>) => {
    alert(" i am form this form ")
    alert(JSON.stringify(values));
  };


  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session == null) return <> go back and login first </>
  form.setValue("userId", session.user.id);

  if (!session) {
    return (
      <div className="mx-auto max-w-3xl py-4">
        <div className="text-center p-8 rounded-lg border border-red-200 bg-red-50">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Authentication Required</h2>
          <p className="text-red-600">Please log in to access the customer form.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="">
      <Card className=" max-w-4xl  border-none shadow-none mx-auto  dark:bg-accent/15">
        <CardHeader>
          <CardDescription>Fill out the details to add a new Segment.</CardDescription>
        </CardHeader>
        <CardContent className="-mt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full" >
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Segment name</FormLabel>
                      <Input {...field} placeholder="lab Name" />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Room No</FormLabel>
                      <Input disabled {...field} placeholder="" />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <QueryBuilder
                fields={exampleFields}
                defaultQuery={defaultQuery}
                onQueryChange={(newQuery) => form.setValue("rules", newQuery)}
              />

              <Button disabled={isPending} className="w-full" type="submit">
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <div className="flex gap-2 items-center">
                    Add Class
                    <CirclePlus />
                  </div>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

