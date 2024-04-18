import { format } from "date-fns";
import { pt } from "date-fns/locale"; // ? https://blog.cubos.academy/date-fns-a-ferramenta-essencial/

import prismadb from "@/lib/prismadb";
import { BillboardClient } from "./components/client";
import { type BillboardColumn } from "./components/columns";

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards: Array<BillboardColumn> = billboards.map(
    (item: BillboardColumn) => ({
      id: item.id,
      label: item.label,
      createdAt: format(item.createdAt, "dd 'de' LLLL 'de' yyyy 'às' HH:mm", {
        locale: pt,
      }),
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
