"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { type Color } from "@prisma/client";
import { Palette, Trash, Undo2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { Hue, Saturation, useColor } from "react-color-palette";
import "react-color-palette/css";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/modals/alert-modal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  value: z.object({
    hex: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
      message: "Texto deve conter um código HEX válido",
    }),
  }),
});

type ColorFormValues = z.infer<typeof formSchema>;

interface ColorFormProps {
  initialData: Color | null;
}

export const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const [color, setColor] = useColor(initialData?.value ?? "#FFF");

  const handleColorChange = (newColor: any) => {
    setColor(newColor);
    form.setValue("value", newColor);
  };

  const title = initialData ? "Editar cor" : "Criar cor";
  const description = initialData ? "Editar uma cor" : "Criar uma nova cor";
  const toastMessageSuccess = initialData
    ? "Cor atualizada com sucesso."
    : "Cor criada com sucesso!";
  const toastMessageError = initialData
    ? "Algo correu mal ao atualizar a cor!"
    : "Algo correu mal ao criar a cor!";
  const action = initialData ? "Guardar alterações" : "Criar";

  const defaultValues = initialData
    ? {
        name: initialData.name || "",
        value:
          typeof initialData.value === "string"
            ? { hex: initialData.value }
            : { hex: "" },
      }
    : {
        name: "",
        value: { hex: "" },
      };

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = async (data: ColorFormValues) => {
    try {
      setLoading(true);

      const endpoint = initialData
        ? `/api/${params.storeId}/colors/${params.colorId}`
        : `/api/${params.storeId}/colors`;

      const method = initialData ? axios.patch : axios.post;

      // Modify the data object to send only the hexadecimal value of the color
      const hexValue = color.hex; // Gets the hexadecimal value of the current color
      const newData = { ...data, value: hexValue }; // Updates the value in the date object

      await method(endpoint, newData);

      router.push(`/${params.storeId}/colors`);
      router.refresh();
      toast.success(toastMessageSuccess);
    } catch (error) {
      toast.error(toastMessageError);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      // Delete the color
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);

      toast.success("Cor apagada com sucesso.");
      router.push(`/${params.storeId}/colors`);
      router.refresh();
    } catch (error) {
      toast.error(
        "Certifique-se que remove todos os produtos que usam esta cor, antes de a apagar."
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
        buttonLabel="Apagar cor"
        description="A cor será permanentemente eliminada. Esta operação não pode ser revertida."
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        <div className="flex items-center">
          <Button
            className="mx-2"
            onClick={() => {
              router.push(`/${params.storeId}/colors`);
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
      </div>
      <Separator />
      <Alert>
        <Palette className="h-4 w-4" />
        <AlertTitle>Guia de criação de Cores</AlertTitle>
        <AlertDescription>
          Crie cores ilimitadas! Insira o nome da cor e escolha na paleta a cor
          perfeita para destacar os seus produtos.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full md:w-1/2"
        >
          <div className="grid grid-cols-1 gap-8">
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
                      placeholder="Nome da cor"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
                  <FormControl>
                    <div className="flex flex-col items-center">
                      <Saturation
                        height={300}
                        color={color}
                        onChange={handleColorChange}
                      />
                      <div className="my-2">{/* Space div */}</div>
                      <Hue color={color} onChange={handleColorChange} />
                    </div>
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
