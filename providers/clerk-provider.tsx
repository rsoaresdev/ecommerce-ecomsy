"use client";

import { ClerkProvider as Clerk } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

import translations from "@/public/clerk"; // File with localizations strings of Clerk

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  return (
    <Clerk
      localization={translations}
      appearance={{
        baseTheme: resolvedTheme === "light" ? undefined : dark,
      }}
    >
      {children}
    </Clerk>
  );
}
