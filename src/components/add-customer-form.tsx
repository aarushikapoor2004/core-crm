"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { useSession } from "next-auth/react";
import axios from 'axios';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { customerFormSchema, defaultValues } from "@/schema/customer";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import type { ApiResponse } from "@/types";

export function CustomerForm() {
  const { data: session, status } = useSession();

  const form = useForm<z.infer<typeof customerFormSchema>>({
    resolver: zodResolver(customerFormSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "entries",
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: z.infer<typeof customerFormSchema>) => {
    startTransition(async () => {
      if (status === "loading") {
        toast.error("Please wait, checking authentication...");
        return;
      }

      if (!session?.user?.id) {
        toast.error("Unauthenticated request. Please log in to continue.");
        return;
      }

      try {
        const payload = {
          ...values,
          userId: session.user.id
        };

        const baseUrl =
          process.env.NODE_ENV === "production"
            ? "https://core-crm-22bcs14907.vercel.app"
            : "http://localhost:3000";
        const res = await axios.post<ApiResponse>(
          `${baseUrl}/api/customers`,
          payload
        );

        const result = res.data;
        if (result.success) {
          toast.success(result.message);
          form.reset();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error("Frontend error while submitting form:", error);
        toast.error("Something went wrong while submitting the form.");
      }
    });
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto space-y-8 max-w-3xl py-4 rounded-lg"
      >
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Create Customers</h2>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-wrap items-end gap-4 p-4 rounded-lg border"
              >
                <FormField
                  control={form.control}
                  name={`entries.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-[200px]">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter customer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`entries.${index}.email`}
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-[200px]">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`entries.${index}.phoneNumber`}
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-[200px]">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Enter phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`entries.${index}.age`}
                  render={({ field }) => (
                    <FormItem className="w-32">
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Age"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => remove(index)}
                  className="text-destructive"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  name: "",
                  email: "",
                  phoneNumber: "",
                  age: 0,
                })
              }
              className="w-full"
            >
              Add Customer Entry
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
