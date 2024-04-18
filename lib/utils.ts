import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

export const formatter = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "EUR"
})