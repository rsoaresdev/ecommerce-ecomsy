"use client";

import { format } from "date-fns";
import { pt } from "date-fns/locale"; // ? https://blog.cubos.academy/date-fns-a-ferramenta-essencial/

import { type ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export interface ColorColumn {
  id: string;
  name: string;
  value: string;
  createdAt: Date;
}

export const columns: Array<ColumnDef<ColorColumn>> = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "value",
    header: "Valor",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {/* As tailwind is rendered JIT (Just-in-time), there is a chance that if I use styles in className they won't be compiled. */}
        <div
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.value }}
        ></div>
        {row.original.value}
      </div>
    ),
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
