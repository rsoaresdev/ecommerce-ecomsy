"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

import { type CategoryColumn, columns } from "./columns";

interface CategoryClientProps {
  data: Array<CategoryColumn>;
}

export const CategoryClient: React.FC<CategoryClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categorias (${data.length})`}
          description="Configure as categorias da sua loja"
        />
        <Button
          onClick={() => {
            router.push(`/${params.storeId}/categories/new`);
          }}
        >
          <Plus className="mr-0 sm:mr-2 h-4 w-4" />
          <span className="hidden sm:block">Adicionar nova</span>
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};
