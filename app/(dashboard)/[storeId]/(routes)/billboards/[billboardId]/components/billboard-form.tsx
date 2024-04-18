"use client";

import * as z from "zod";
import axios from "axios";

import { useEffect, useState } from "react";
import { type Billboard } from "@prisma/client";
import { Trash, Undo2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

import { UploadDropzone } from "@/utils/uploadthing";
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
import translation from "zod-i18n-map/locales/pt/zod.json"; // Import portuguese language translation files

i18next.init({
  lng: "pt",
  resources: {
    pt: { zod: translation },
  },
});
z.setErrorMap(zodI18nMap);

const formSchema = z.object({
  label: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9áéíóúâêîôûãõñç ]+$/, {
      message: "Texto deve conter apenas letras e números",
    })
    .refine((value) => value.trim() === value, {
      message: "Texto não pode conter espaços em branco no início ou no final",
    }),
  imageUrl: z.string().refine((data) => data.length > 0, {
    message: "Imagem obrigatória",
  }),
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
  initialData: Billboard | null;
}

export const BillboardForm: React.FC<BillboardFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();

  const [openDelete, setOpenDelete] = useState(false);
  const [openRemoveImage, setOpenRemoveImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  // Delete the UploadThing billboard image when leave or leave the page.
  useEffect(() => {
    const handleBeforeUnload = async () => {
      // It only proceeds when there is an imageURL (i.e. when the image is first uploaded).
      if (imageUrl) {
        // Delete the billboard image from UploadThing here
        try {
          await axios.delete("/api/uploadthing", {
            data: {
              url: imageUrl || initialData?.imageUrl,
            },
          });
        } catch (error) {
          console.error("[BILLBOARD-FORM]:", error);
        }
      }
    };

    // Attach the event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Detach the event listener when the component is unmounted
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [imageUrl, initialData]);

  const title = initialData ? "Editar painel" : "Criar painel";
  const description = initialData
    ? "Editar um painel publicitário"
    : "Criar um novo painel";
  const toastMessageSuccess = initialData
    ? "Painel atualizado com sucesso."
    : "Painel criado com sucesso!";
  const toastMessageError = initialData
    ? "Algo correu mal ao atualizar o painel!"
    : "Algo correu mal ao criar o painel!";
  const action = initialData ? "Guardar alterações" : "Criar";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true);

      const endpoint = initialData
        ? `/api/${params.storeId}/billboards/${params.billboardId}`
        : `/api/${params.storeId}/billboards`;

      const method = initialData ? axios.patch : axios.post;

      await method(endpoint, data);

      router.push(`/${params.storeId}/billboards`);
      router.refresh();
      toast.success(toastMessageSuccess);
    } catch (error) {
      toast.error(toastMessageError);
    } finally {
      setLoading(false);
    }
  };

  // It won't be possible to delete the billboards with categories in it.
  const onDelete = async () => {
    try {
      setLoading(true);

      // Delete the billboard
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );

      // Delete the billboard image from UploadThing
      await axios.delete("/api/uploadthing", {
        data: {
          url: initialData?.imageUrl,
        },
      });

      toast.success("Painel apagado com sucesso.");
      router.push(`/${params.storeId}/billboards`);
      router.refresh();
    } catch (error) {
      toast.error(
        "Certifique-se que remove todas as categorias que usam este painel, antes de o apagar."
      );
    } finally {
      setLoading(false);
      setOpenDelete(false);
    }
  };

  // Event trigger when edit image
  const onRemoveImage = async () => {
    try {
      setLoading(true);

      const imageUrlToDelete = imageUrl || initialData?.imageUrl;

      if (!imageUrl) {
        // Clear the imageUrl field
        await axios.patch("/api/uploadthing", {
          data: {
            url: imageUrlToDelete,
          },
        });
      }

      // Delete the billboard image from UploadThing
      await axios.delete("/api/uploadthing", {
        data: {
          url: imageUrlToDelete,
        },
      });

      // Reload the webview
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error("Ocorreu um erro inesperado ao apagar a imagem.");
    } finally {
      setLoading(false);
      setOpenRemoveImage(false);
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
        buttonLabel="Apagar painel"
        description="O painel será permanentemente eliminado. Esta operação não pode ser revertida."
      />
      <AlertModal
        isOpen={openRemoveImage}
        onClose={() => {
          setOpenRemoveImage(false);
        }}
        onConfirm={async () => {
          await onRemoveImage();
        }}
        loading={loading}
        buttonLabel="Apagar imagem"
        description="A imagem será permanentemente eliminada. Esta operação não pode ser revertida."
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        <Button
          onClick={() => {
            router.push(`/${params.storeId}/billboards`);
          }}
        >
          <Undo2 className="mr-2 h-4 w-4" />
          Voltar
        </Button>
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
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagem</FormLabel>
                  <FormControl>
                    {imageUrl || field.value ? (
                      <div>
                        <Image
                          src={imageUrl || field.value}
                          alt="billboard image"
                          width={1920}
                          height={1080}
                          className="object-cover border-2 rounded-md border-dashed bg-[f8fafc] border-[c3c5c9]"
                          priority
                        />
                        <Button
                          disabled={loading}
                          variant="destructive"
                          onClick={() => {
                            setOpenRemoveImage(true);
                          }}
                          type="button"
                          className="ml-auto mt-2"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Remover imagem
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <UploadDropzone
                          className="bg-zinc-100 ut-label:text-sm ut-allowed-content:ut-uploading:text-red-400"
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            console.log("Image uploaded: ", res[0].url);
                            setImageUrl(res[0].url);
                            field.onChange(res[0].url);
                          }}
                          onUploadError={(error: Error) => {
                            toast.error("You can only send one image!");
                            console.log(error);
                          }}
                        />
                      </div>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Nome do painel"
                      {...field}
                    />
                  </FormControl>
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
