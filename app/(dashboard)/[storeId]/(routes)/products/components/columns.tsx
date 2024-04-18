import { type ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export interface ProductColumn {
  id: string;
  name: string;
  price: string;
  size: string;
  category: string;
  colorName: string;
  colorValue: string;
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: string;
}

export const columns: Array<ColumnDef<ProductColumn>> = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "isArchived",
    header: "Arquivado?",
    cell: ({ row }) => (row.original.isArchived ? "Sim" : "Não"),
  },
  {
    accessorKey: "isFeatured",
    header: "Destacado?",
    cell: ({ row }) => (row.original.isFeatured ? "Sim" : "Não"),
  },
  {
    accessorKey: "price",
    header: "Preço",
  },
  {
    accessorKey: "category",
    header: "Categoria",
  },
  {
    accessorKey: "size",
    header: "Tamanho",
  },
  {
    accessorKey: "color",
    header: "Cor",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <div
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.colorValue }}
        />
        {row.original.colorName}
      </div>
    ),
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
