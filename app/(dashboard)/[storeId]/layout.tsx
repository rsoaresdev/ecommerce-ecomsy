import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import Navbar from "@/components/navbar";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const { userId } = auth();

  // If the user is not logged in, it redirects to the login page
  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  // In practice, the user can enter an id for a store that doesn't exist. If this happens, it redirects to '/'
  if (!store) {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
