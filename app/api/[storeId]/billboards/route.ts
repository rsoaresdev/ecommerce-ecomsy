import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { label, imageUrl } = body;

    // If the user is not logged in, throw error 401
    if (!userId) {
      return new NextResponse("Não autenticado", { status: 401 });
    }

    // If the label parameter is not passed, throw error 400
    if (!label) {
      return new NextResponse("Parâmetro 'label' obrigatório!", {
        status: 400,
      });
    }

    // If the imageUrl parameter is not passed, throw error 400
    if (!imageUrl) {
      return new NextResponse("Parâmetro 'imageUrl' obrigatório!", {
        status: 400,
      });
    }

    if (!params.storeId) {
      // If the storeId parameter is not passed, throw error 400
      return new NextResponse("Parâmetro 'storeId' obrigatório!", {
        status: 400,
      });
    }

    // Checks if the logged-in user owns the 'storeId' store. To prevent billboards being created in stores that are not owned.
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      // If the user is trying to change a store that is not theirs, throw error 403
      return new NextResponse("Não autorizado", {
        status: 403,
      });
    }

    // Create a billboard
    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    // TODO: Stop using console.log and switch to a logging service
    console.log("[BILLBOARDS_POST]: ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      // If the storeId parameter is not passed, throw error 400
      return new NextResponse("Parâmetro 'storeId' obrigatório!", {
        status: 400,
      });
    }

    // Get all billboards
    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    // TODO: Stop using console.log and switch to a logging service
    console.log("[BILLBOARDS_GET]: ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
