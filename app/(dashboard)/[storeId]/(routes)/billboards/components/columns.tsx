"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export interface BillboardColumn {
  id: string;
  label: string;
  createdAt: string;
}

export const columns: Array<ColumnDef<BillboardColumn>> = [
  {
    accessorKey: "label",
    header: "Nome",
  },
  {
    accessorKey: "createdAt",
    header: "Data de Criação",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
