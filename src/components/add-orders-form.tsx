"use client"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTransition } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { z } from "zod"
import { orderFormSchema, defaultValues } from "@/schema/order"
import { Trash, Calendar } from "lucide-react"
import { toast } from "sonner"
import type { ApiResponse } from "@/types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function OrderForm() {
  const { data: session, status } = useSession()

  const form = useForm<z.infer<typeof orderFormSchema>>({
    resolver: zodResolver(orderFormSchema),
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "entries",
  })

  const [isPending, startTransition] = useTransition()

  const onSubmit = (values: z.infer<typeof orderFormSchema>) => {
    startTransition(async () => {
      if (status === "loading") {
        toast.error("Please wait, checking authentication...")
        return
      }
      if (!session?.user?.id) {
        toast.error("Unauthenticated request. Please log in to continue.")
        return
      }

      try {
        const payload = {
          ...values,
          userId: session.user.id,
        }


        const baseUrl =
          process.env.NODE_ENV === "production"
            ? "https://core-crm-22bcs14907.vercel.app"
            : "http://localhost:3000";

        const res = await axios.post<ApiResponse>(
          `${baseUrl}/api/orders`,
          payload
        );

        const result = res.data
        if (result.success) {
          toast.success(result.message)
          // form.reset();
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        console.error("Frontend error while submitting form:", error)
        toast.error("Something went wrong while submitting the form.")
      }
    })
  }

  // Show loading state while session is being fetched
  if (status === "loading") {
    return <div>Loading...</div>
  }

  // Show authentication required message if not logged in
  if (!session) {
    return (
      <div className="mx-auto max-w-3xl py-4">
        <div className="text-center p-8 rounded-lg border border-red-200 bg-red-50">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Authentication Required</h2>
          <p className="text-red-600">Please log in to access the order form.</p>
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto space-y-8 max-w-3xl py-4 rounded-lg">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Create Orders</h2>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-wrap items-end gap-4 p-4 rounded-lg border">
                <FormField
                  control={form.control}
                  name={`entries.${index}.customerId`}
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-[200px]">
                      <FormLabel>Customer ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter customer ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`entries.${index}.status`}
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-[200px]">
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`entries.${index}.amount`}
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-[150px]">
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter amount"
                          {...field}
                          onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`entries.${index}.orderDate`}
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-[200px]">
                      <FormLabel>Order Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="button" variant="ghost" onClick={() => remove(index)} className="text-destructive">
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  customerId: "",
                  status: "pending",
                  amount: 0,
                  orderDate: new Date(),
                })
              }
              className="w-full"
            >
              Add Order Entry
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
