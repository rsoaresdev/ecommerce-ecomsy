import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // When the user enter the dashboard, the store to load is the one Prisma finds first
  const store = await prismadb.store.findFirst({
    where: {
      userId,
    },
  });

  // Redirects to the store found
  if (store) {
    redirect(`/${store.id}`);
  }

  return <>{children}</>;
}
