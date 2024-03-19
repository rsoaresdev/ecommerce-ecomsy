import type { Metadata } from "next";

import { Inter } from "next/font/google";

import { ModalProvider } from "@/providers/modal-provider";
import { ClerkProvider } from "@/providers/clerk-provider";
import { ThemeProvider } from "@/providers/theme-provider";

import { Toaster } from "@/components/ui/sonner";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { fileRouter } from "@/app/api/uploadthing/core";

import "./globals.css";
import "@uploadthing/react/styles.css";

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
    <html lang="pt" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider>
            <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />
            <main className="flex-1 h-full">
              <ModalProvider />
              <Toaster position="bottom-left" expand={false} richColors />
              {children}
            </main>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
