import { format } from "date-fns";
import { pt } from "date-fns/locale"; // ? https://blog.cubos.academy/date-fns-a-ferramenta-essencial/

import prismadb from "@/lib/prismadb";
import { SizesClient } from "./components/client";
import { type SizeColumn } from "./components/columns";

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSizes: Array<SizeColumn> = sizes.map((item: SizeColumn) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "dd 'de' LLLL 'de' yyyy 'às' HH:mm", {
      locale: pt,
    }),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
