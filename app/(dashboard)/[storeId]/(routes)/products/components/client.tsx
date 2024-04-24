"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

import { type ProductColumn, columns } from "./columns";

interface ProductClientProps {
  data: Array<ProductColumn>;
}

export const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Produtos (${data.length})`}
          description="Configure os produtos da sua loja"
        />
        <Button
          onClick={() => {
            router.push(`/${params.storeId}/products/new`);
          }}
        >
          <Plus className="mr-0 sm:mr-2 h-4 w-4" />
          <span className="hidden sm:block">Adicionar novo</span>
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};
