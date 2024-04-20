"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ScrollText, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet";
import ButtonsNavBar from "@/components/navbar/buttons-navbar";

interface NavigationComponent {
  title: string;
  href: string;
  icon?: ReactNode;
}

export default function MainNav() {
  const params = useParams();

  const components: NavigationComponent[] = [
    {
      title: "Relatório",
      href: `/`,
      icon: <ScrollText className="h-5 w-5" />,
    },
    {
      title: "Definições",
      href: `settings`,
      icon: <Settings className="h-5 w-5" />,
    },
    {
      title: "Produtos",
      href: `products`,
    },
    {
      title: "Paineis Publicitários",
      href: `billboards`,
    },
    {
      title: "Categorias",
      href: `categories`,
    },
    {
      title: "Tamanhos",
      href: `sizes`,
    },
    {
      title: "Cores",
      href: `colors`,
    },
  ];

  return (
    <header className="flex h-20 shrink-0 items-center px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button className="lg:hidden" size="icon" variant="outline">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="grid gap-2 py-6">
            {components.map((component) => (
              <Link
                key={component.title}
                className="flex w-full items-center py-2 text-lg font-semibold"
                href={`/${params.storeId}/${component.href}`}
              >
                {component.title}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
      <nav className="ml-auto hidden lg:flex gap-6">
        {components.map((component) => (
          <Link
            key={component.title}
            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
            href={`/${params.storeId}/${component.href}`}
          >
            {component.icon ?? component.title}
          </Link>
        ))}
      </nav>
      <div className="border-[0.7px] rounded-md border-gray-400 mx-4 h-6"></div>
      <ButtonsNavBar />
    </header>
  );
}

function MenuIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
