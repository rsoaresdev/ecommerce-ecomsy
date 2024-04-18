"use client";

import { useParams, usePathname } from "next/navigation";
import { forwardRef, ElementRef, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";

export function MainNav({ className }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const components: { title: string; href: string; description: string }[] = [
    {
      title: "Produtos",
      href: `products`,
      description: "Administre a sua variedade de produtos com facilidade.",
    },
    {
      title: "Paineis Publicitários",
      href: `billboards`,
      description:
        "Crie painéis atraentes e informativos para promover eventos e produtos.",
    },
    {
      title: "Categorias",
      href: `categories`,
      description: "Defina categorias lógicas para os produtos da sua loja.",
    },
    {
      title: "Tamanhos",
      href: `sizes`,
      description: "Liste todos os tamanhos disponíveis para cada produto.",
    },
    {
      title: "Cores",
      href: `colors`,
      description:
        "Ofereça uma ampla variedade de cores para os seus produtos.",
    },
  ];

  // Uses the 'cn' library to merge styles
  return (
    <NavigationMenu
      className={cn(
        "flex items-center space-x-3 lg:space-x-3 list-none",
        className
      )}
    >
      {/* Relatório */}
      <NavigationMenuItem key={`/${params.storeId}`}>
        <Link href={`/${params.storeId}`} legacyBehavior passHref>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            active={pathname === `/${params.storeId}`}
          >
            Relatório
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>

      {/* Gestão de Loja */}
      <NavigationMenuItem>
        <NavigationMenuTrigger>Gestão de Loja</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
            {components.map((component) => (
              <ListItem
                key={component.title}
                title={component.title}
                href={`/${params.storeId}/${component.href}`}
              >
                {component.description}
              </ListItem>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>

      {/* Definições */}
      <NavigationMenuItem key={`/${params.storeId}/settings`}>
        <Link href={`/${params.storeId}/settings`} legacyBehavior passHref>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            active={pathname === `/${params.storeId}/settings`}
          >
            Definições
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    </NavigationMenu>
  );
}

const ListItem = forwardRef<ElementRef<"a">, ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <ul>
        <li>
          <NavigationMenuLink asChild>
            <a
              ref={ref}
              className={cn(
                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                className
              )}
              {...props}
            >
              <div className="text-base font-semibold leading-none">
                {title}
              </div>
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                {children}
              </p>
            </a>
          </NavigationMenuLink>
        </li>
      </ul>
    );
  }
);
ListItem.displayName = "ListItem";
