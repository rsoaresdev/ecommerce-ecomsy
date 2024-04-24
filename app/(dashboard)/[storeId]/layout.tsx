import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Navbar from "@/components/navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const { userId } = auth();

  // If the user is not logged in, it redirects to the login page
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
