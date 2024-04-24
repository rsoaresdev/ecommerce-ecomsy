import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    // If the user is not logged in, throw error 401
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // If the name parameter is not passed, throw error 400
    if (!name) {
      return new NextResponse("name is required!", { status: 400 });
    }

    // If the storeId parameter is not passed, throw error 400
    if (!params.storeId) {
      return new NextResponse("storeId is required!", {
        status: 400,
      });
    }

    // Update the name of the store
    const store = await prismadb.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    // TODO: Stop using console.log and switch to a logging service
    console.log("[STORE_PATCH]: ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    // If the user is not logged in, throw error 401
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // If the storeId parameter is not passed, throw error 400
    if (!params.storeId) {
      return new NextResponse("storeId is required!", {
        status: 400,
      });
    }

    // Update the name of the store
    const store = await prismadb.store.deleteMany({
      where: {
        id: params.storeId,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    // TODO: Stop using console.log and switch to a logging service
    console.log("[STORE_DELETE]: ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
