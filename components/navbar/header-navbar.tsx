"use client";

import Link from "next/link";
import Image from "next/image";

export default function HeaderNavbar() {
  return (
    <Link className="flex items-center mr-6 lg:flex" href="/">
      <Image
        src={"https://ecomsy.site/logo.png"}
        alt="ecomsy logo"
        width={20}
        height={31}
      />
      <span className="ml-3 hidden lg:block self-center text-2xl font-bold whitespace-nowrap dark:text-white">
        Ecomsy
      </span>
      <span className="sr-only">Ecomsy</span>
    </Link>
  );
}
