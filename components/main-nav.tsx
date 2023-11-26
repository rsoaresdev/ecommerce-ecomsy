"use client";

import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import Link from "next/link";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: "Relatório",
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: "Paineis Publicitários",
      active: pathname === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Definições",
      active: pathname === `/${params.storeId}/settings`,
    },
  ];

  // Uses the 'cn' library to merge styles
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out",
            route.active
              ? "bg-slate-500 text-white dark:bg-gray-700 dark:text-white"
              : "text-zinc-600 hover:bg-slate-400 hover:text-white dark:hover:bg-gray-700 dark:hover:text-white"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
