"use client";

import { useState } from "react";
import Image from "next/image";

import * as z from "zod";
import {
  Category,
  Color,
  Image as ImageModel,
  Product,
  Size,
} from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Package, PackageSearch, Trash, Undo2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { UploadDropzone } from "@/utils/uploadthing";
import { ClientUploadedFileData } from "uploadthing/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Configure zod language
import i18next from "i18next";
import { zodI18nMap } from "zod-i18n-map";
import translation from "zod-i18n-map/locales/pt/zod.json"; // Import portuguese language translation files

i18next.init({
  lng: "pt",
  resources: {
    pt: { zod: translation },
  },
});
z.setErrorMap(zodI18nMap);

interface ProductFromProps {
  initialData:
    | (Product & {
        images: ImageModel[];
      })
    | null;
  categories: Category[];
  colors: Color[];
  sizes: Size[];
}

const formSchema = z.object({
  name: z
    .string()
    .min(1)
    .regex(/^[a-zA-Z0-9áéíóúâêîôûãõñç ]+$/, {
      message: "Texto deve conter apenas letras e números",
    })
    .refine((value) => value.trim() === value, {
      message: "Texto não pode conter espaços em branco no início ou no final",
    }),
  images: z
    .array(
      z.string().min(1) // Validate that the image URL is not empty
    )
    .nonempty(), // Ensure that the image array is not empty

  price: z.coerce.number().min(1).max(9999999), // Max 9.9M
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

export const ProductForm: React.FC<ProductFromProps> = ({
  initialData,
  categories,
  colors,
  sizes,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Editar produto" : "Criar produto";
  const description = initialData
    ? "Editar produto"
    : "Criar um novo produto na sua loja";
  const toastMessageSuccess = initialData
    ? "Produto atualizado com sucesso."
    : "Produto criado com sucesso.";
  const toastMessageError = initialData
    ? "Algo correu mal ao atualizar o produto!"
    : "Algo correu mal ao criar o produto!";
  const action = initialData ? "Guardar alterações" : "Criar";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(String(initialData?.price)),
          images: initialData.images.map((image: { url: string }) => image.url),
        }
      : {
          name: "",
          images: [],
          price: 0,
          categoryId: "",
          colorId: "",
          sizeId: "",
          isFeatured: false,
          isArchived: false,
        },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/products`, data);
      }
      router.push(`/${params.storeId}/products`);
      toast.success(toastMessageSuccess);
      router.refresh();
    } catch (err) {
      toast.error(toastMessageError);
    } finally {
      setLoading(false);
    }
  };

  // It won't be possible to delete the product with dependencies associated.
  const onDelete = async () => {
    try {
      setLoading(true);

      // Delete the product and images associated
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);

      toast.success("Produto apagado com sucesso.");
      router.push(`/${params.storeId}/products`);
      router.refresh();
    } catch (err) {
      toast.error(
        "Certifique-se que remove todas as categorias que usam este produto, antes de o apagar."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const deleteImage = async (urlToDelete: string) => {
    try {
      setLoading(true);

      // Delete the image from S3
      try {
        await axios.delete("/api/uploadthing", {
          data: {
            url: urlToDelete,
          },
        });
      } catch (error) {
        console.error("[PRODUCT-FORM]:", error);
      }

      toast.success("Imagem removida com sucesso.");
    } catch (err) {
      // TODO: Register error on a logging service
      toast.error("Ocorreu um erro ao apagar a imagem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        buttonLabel="Apagar produto"
        description="O produto será permanentemente eliminado. Esta operação não pode ser revertida."
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        <div className="flex items-center">
          <Button
            className="mx-2"
            onClick={() => {
              router.push(`/${params.storeId}/products`);
            }}
          >
            <Undo2 className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          {initialData && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setOpen(true)}
              disabled={loading}
            >
              <Trash className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      <Separator />
      <Alert>
        <PackageSearch className="h-4 w-4" />
        <AlertTitle>Guia de criação de Produtos</AlertTitle>
        <AlertDescription>
          Dê vida aos seus produtos! Aqui, você pode personalizar cada detalhe.
          Crie algo que reflita a sua visão única
          <br />
          Pode carregar até 10 imagens, para poder mostrar ao mundo todos os
          ângulos do seu produto!
        </AlertDescription>
      </Alert>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Imagens</FormLabel>
                  <FormControl>
                    {!field.value || field.value.length === 0 ? (
                      <div>
                        <UploadDropzone
                          className="dark:bg-slate-800 ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300"
                          endpoint="productsImagesUploader"
                          onClientUploadComplete={(files) => {
                            const newImages = [...field.value]; // Create a copy of the existing image array
                            files.forEach(
                              (
                                file: ClientUploadedFileData<{
                                  uploadedBy: string;
                                }>
                              ) => {
                                const imageUrl = file.url; // Extracts the image URL from the returned object
                                newImages.push(imageUrl); // Add the URL of the new image to the existing image array
                              }
                            );
                            field.onChange(newImages); // Update the field value with the new array of images
                          }}
                          onUploadError={(error: Error) => {
                            // TODO: Register error on a logging service
                            if (error.message == "Maximum file count not met") {
                              toast.error("Só é possível carregar 10 imagens!");
                            } else {
                              toast.error(
                                "Ocorreu um erro ao carregar imagem!"
                              );
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-4">
                        {field.value.map((imageUrl: string, index: number) => (
                          <div key={index} className="mb-4">
                            <Image
                              src={imageUrl}
                              alt={`product image ${index}`}
                              width={1920}
                              height={1080}
                              className="object-cover border-2 rounded-md border-dashed bg-[f8fafc] border-[c3c5c9]"
                              priority
                            />
                            <Button
                              disabled={loading}
                              variant="destructive"
                              onClick={() => {
                                const newImages = [...field.value]; // Create a copy of the existing image array
                                newImages.splice(index, 1); // Removes the image from the array
                                field.onChange(newImages); // Update the field value with the new array of images
                                deleteImage(field.value[index]);
                              }}
                              type="button"
                              className="ml-auto mt-2"
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Remover imagem
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      disabled={loading}
                      placeholder="Nome do produto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      type="number"
                      disabled={loading}
                      placeholder="Preço do produto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
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
                          placeholder="Selecione uma categoria"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tamanho</FormLabel>
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
                          placeholder="Selecione um tamanho"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
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
                          placeholder="Selecione uma cor"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem
                          style={{ display: "flex" }}
                          key={color.id}
                          value={color.id}
                        >
                          <span style={{ color: color.value }}>
                            {color.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Destacado</FormLabel>
                    <FormDescription>
                      O produto deve aparecer em destaque na página inicial.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Arquivado</FormLabel>
                    <FormDescription>
                      O produto não deve estar disponível para compra, nem
                      visível.
                    </FormDescription>
                  </div>
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
