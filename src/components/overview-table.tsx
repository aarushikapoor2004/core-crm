"use client";

import { ColumnDef } from "@tanstack/react-table";
import { getCoustomerSchema } from "@/schema/customer";
import { DataTable } from "@/components/data-table";

export const columns: ColumnDef<getCoustomerSchema>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    accessorKey: "_count.orders",
    header: "Order Count",
    cell: ({ row }) => row.original._count.orders,
  },
];


export function OverviewTable({ data = [] }: { data: getCoustomerSchema[] }) {

  return (
    <div className="" >
      <DataTable columns={columns} data={data} />
    </ div >

  );
}
