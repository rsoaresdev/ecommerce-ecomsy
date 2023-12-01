"use client";

import { useState } from "react";
import axios from "axios";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-modal";

import { BillboardColumn } from "./columns";

interface CellActionProps {
  data: BillboardColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast("Copiado!", {
      icon: "📋",
    });
  };

  // It won't be possible to delete the store with products and categories in it.
  const onDelete = async () => {
    try {
      setLoading(true);

      //! It's important to delete the image first rather than the billboard, so that axios can get the billboard data!

      // Delete the billboard image from UploadThing
      const billboardUrlResponse = await axios.get(
        `/api/${params.storeId}/billboards/${data.id}`
      );

      const billboardUrl = billboardUrlResponse.data.imageUrl;

      if (billboardUrl) {
        await axios.delete("/api/uploadthing", {
          data: {
            url: billboardUrl,
          },
        });
      }

      // Delete the billboard
      await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);

      router.refresh();
      toast.success("Painel apagado com sucesso.");
      // router.push("/");
    } catch (error) {
      toast.error(
        "Certifique-se que remove todas as categorias que usam este painel, antes de o apagar."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        buttonLabel="Apagar painel"
        description="O painel será permanentemente eliminado. Esta operação não pode ser revertida."
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            {/* sr-only: Only visible to screen readers */}
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Copiar ID
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/${params.storeId}/billboards/${data.id}`)
            }
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" />
            Apagar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
