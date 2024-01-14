"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export interface SizeColumn {
  id: string;
  name: string;
  value: string;
  createdAt: string;
}

export const columns: Array<ColumnDef<SizeColumn>> = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "value",
    header: "Valor",
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
