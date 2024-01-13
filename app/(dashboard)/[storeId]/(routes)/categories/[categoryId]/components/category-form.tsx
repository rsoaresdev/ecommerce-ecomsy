"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { type Billboard, type Category } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/modals/alert-modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Configure zod language
import i18next from "i18next";
import { zodI18nMap } from "zod-i18n-map";
import translation from "zod-i18n-map/locales/PT/zod.json"; // Import portuguese language translation files
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

i18next.init({
  lng: "pt",
  resources: {
    pt: { zod: translation },
  },
});
z.setErrorMap(zodI18nMap);

const formSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9áéíóúâêîôûãõñç ]+$/, {
      message: "Texto deve conter apenas letras e números",
    })
    .refine((value) => value.trim() === value, {
      message: "Texto não pode conter espaços em branco no início ou no final",
    }),
  billboardId: z.string().refine((data) => data.length > 0, {
    message: "Selecione um painel publicitário",
  }),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData: Category | null;
  billboards: Array<Billboard>;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  billboards,
}) => {
  const params = useParams();
  const router = useRouter();

  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Editar categoria" : "Criar categoria";
  const description = initialData
    ? "Editar uma categoria"
    : "Criar uma nova categoria";
  const toastMessageSuccess = initialData
    ? "Categoria atualizada com sucesso."
    : "Categoria criada com sucesso!";
  const toastMessageError = initialData
    ? "Algo correu mal ao atualizar a categoria!"
    : "Algo correu mal ao criar a categoria!";
  const action = initialData ? "Guardar alterações" : "Criar";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      billboardId: "",
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);

      const endpoint = initialData
        ? `/api/${params.storeId}/categories/${params.categoryId}`
        : `/api/${params.storeId}/categories`;

      const method = initialData ? axios.patch : axios.post;

      await method(endpoint, data);

      router.push(`/${params.storeId}/categories`);
      router.refresh();
      toast.success(toastMessageSuccess);
    } catch (error) {
      toast.error(toastMessageError);
    } finally {
      setLoading(false);
    }
  };

  // It won't be possible to delete the category with products in it.
  const onDelete = async () => {
    try {
      setLoading(true);

      // Delete the category
      await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`
      );

      toast.success("Categoria apagada com sucesso.");
      router.push(`/${params.storeId}/categories`);
      router.refresh();
    } catch (error) {
      toast.error(
        "Certifique-se que remove todos os produtos que usam esta categoria, antes de a apagar."
      );
    } finally {
      setLoading(false);
      setOpenDelete(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => {
          setOpenDelete(false);
        }}
        onConfirm={async () => {
          await onDelete();
        }}
        loading={loading}
        buttonLabel="Apagar categoria"
        description="A categoria será permanentemente eliminada. Esta operação não pode ser revertida."
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => {
              setOpenDelete(true);
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Nome da categoria"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Painel Publicitário</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Selecione um painel publicitário"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
