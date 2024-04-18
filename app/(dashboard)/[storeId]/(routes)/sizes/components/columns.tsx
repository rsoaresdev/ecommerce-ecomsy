"use client";

import { format } from "date-fns";
import { pt } from "date-fns/locale"; // ? https://blog.cubos.academy/date-fns-a-ferramenta-essencial/

import { type ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export interface SizeColumn {
  id: string;
  name: string;
  value: string;
  createdAt: Date;
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
    cell: ({ row }) =>
      format(row.original.createdAt, "dd 'de' LLLL 'de' yyyy 'às' HH:mm", {
        locale: pt,
      }),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
