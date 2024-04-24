"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

import { type OrderColumn, columns } from "./columns";

interface OrderClientProps {
  data: Array<OrderColumn>;
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Pedidos (${data.length})`}
        description="Visualize e controle os pedidos da sua loja"
      />
      <Separator />
      <DataTable searchKey="products" columns={columns} data={data} />
    </>
  );
};
