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
  name: z.string().min(1),
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

      const response = await axios.post("/api/stores", values);
      // console.log(response.data);
      // toast.success("Loja criada com sucesso!")

      // I'm using 'window.location.assign' instead of 'router.refresh()', because it ensures a full refresh
      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      // console.log(error);
      toast.error("Algo correu mal ao criar a loja.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Abrir uma nova loja"
      description="Crie a sua loja virtual em minutos e alcance novos clientes."
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
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
                  disabled={loading}
                  variant={"outline"}
                  onClick={storeModal.onClose}
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
