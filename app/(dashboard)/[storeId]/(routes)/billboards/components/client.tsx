"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

import { type BillboardColumn, columns } from "./columns";

interface BillboardClientProps {
  data: Array<BillboardColumn>;
}

export const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Paineis Publicitários (${data.length})`}
          description="Configure os paineis publicitários da sua loja"
        />
        <Button
          onClick={() => {
            router.push(`/${params.storeId}/billboards/new`);
          }}
        >
          <Plus className="mr-0 sm:mr-2 h-4 w-4" />
          <span className="hidden sm:block">Adicionar novo</span>
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="label" columns={columns} data={data} />
    </>
  );
};
