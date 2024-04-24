import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import MainNav from "@/components/navbar/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import HeaderNavbar from "@/components/navbar/header-navbar";

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <nav>
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <HeaderNavbar />
          <StoreSwitcher items={stores} />
          <MainNav />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
