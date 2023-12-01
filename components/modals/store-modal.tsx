"use client";

import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Configure zod language
import i18next from "i18next";
import { zodI18nMap } from "zod-i18n-map";
import translation from "zod-i18n-map/locales/PT/zod.json"; // Import portuguese language translation files

i18next.init({
  lng: "pt",
  resources: {
    pt: { zod: translation },
  },
});
z.setErrorMap(zodI18nMap);

// Validate the shop name. Should be a string, and a minimum of 1 character.
const formSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9 ]+$/, {
      message: "Texto deve conter apenas letras e números.",
    })
    .refine((value) => value.trim() === value, {
      message: "Texto não pode conter espaços em branco no início ou no final.",
    }),
});

export const StoreModal = () => {
  const storeModal = useStoreModal();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      await axios.post("/api/stores", values);
      // Reload the webview
      window.location.reload();
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        toast.error("Não é possível criar mais do que 10 lojas!");
      } else if (error.response && error.response.status === 409) {
        toast.error(
          "Não é possível criar uma loja com o mesmo nome de uma que já possui."
        );
      } else {
        toast.error("Algo correu mal ao criar a loja.");
      }
    } finally {
      setLoading(false);
    }
  };

  function handleCloseModal() {
    // Use the reset function to clear form values and errors
    form.clearErrors();
    storeModal.onClose();
  }

  return (
    <Modal
      title="Abrir uma nova loja"
      description="Crie a sua loja virtual em minutos e alcance novos clientes."
      isOpen={storeModal.isOpen}
      onClose={() => handleCloseModal()}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Insira o nome da sua loja"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  type="reset"
                  disabled={loading}
                  variant={"outline"}
                  onClick={() => handleCloseModal()}
                >
                  Cancelar
                </Button>
                <Button disabled={loading} type="submit">
                  Continuar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
