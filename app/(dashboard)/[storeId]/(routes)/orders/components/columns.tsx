"use client";

import { format } from "date-fns";
import { pt } from "date-fns/locale"; // ? https://blog.cubos.academy/date-fns-a-ferramenta-essencial/

import { type ColumnDef } from "@tanstack/react-table";

export interface OrderColumn {
  id: string;
  phone: string;
  address: string;
  isPaid: boolean;
  totalPrice: string; //? totalPrice is a string, because I formatted it on page.tsx
  products: string; //? products is a string, because I turn the array of products into a string, using #.join
  createdAt: Date;
}

export const columns: Array<ColumnDef<OrderColumn>> = [
  {
    accessorKey: "products",
    header: "Produtos",
  },
  {
    accessorKey: "phone",
    header: "Telemóvel",
  },
  {
    accessorKey: "address",
    header: "Local de Descarga",
  },
  {
    accessorKey: "totalPrice",
    header: "Montante",
  },
  {
    accessorKey: "isPaid",
    header: "Pago?",
  },
];
