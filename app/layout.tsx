import type { Metadata } from "next";

import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import translations from "@/public/clerk"; // File with localizations strings of Clerk
import { ModalProvider } from "@/providers/modal-provider";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ecomsy • Dashboard",
  description:
    "Controlo total sobre a sua loja. Gerir produtos, vendas, inventário e marketing de forma eficiente. Simplifique e impulsione o seu sucesso.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={translations}>
      <html lang="pt">
        <body className={inter.className}>
          <main className="flex-1 h-full">
            <ModalProvider />
            <Toaster position="bottom-left" expand={false} richColors />
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
