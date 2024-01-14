import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
  _req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    // If the sizeId parameter is not passed, throw error 400
    if (!params.sizeId) {
      return new NextResponse("sizeId is required!", {
        status: 400,
      });
    }

    // Get a size by their id
    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    // TODO: Stop using console.log and switch to a logging service
    console.log("[SIZE_GET]: ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, value } = body;

    // If the user is not logged in, throw error 401
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // If the name parameter is not passed, throw error 400
    if (!name) {
      return new NextResponse("name is required!", {
        status: 400,
      });
    }

    // If the value parameter is not passed, throw error 400
    if (!value) {
      return new NextResponse("value is required!", {
        status: 400,
      });
    }

    // If the sizeId parameter is not passed, throw error 400
    if (!params.sizeId) {
      return new NextResponse("sizeId is required!", {
        status: 400,
      });
    }

    // Checks if the logged-in user owns the 'storeId' store. To prevent sizes being updated in stores that are not owned.
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      // If the user is trying to change a store that is not theirs, throw error 403
      return new NextResponse("Unauthorized", {
        status: 403,
      });
    }

    // Update the size(s)
    const size = await prismadb.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    // TODO: Stop using console.log and switch to a logging service
    console.log("[SIZE_PATCH]: ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();

    // If the user is not logged in, throw error 401
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // If the sizeId parameter is not passed, throw error 400
    if (!params.sizeId) {
      return new NextResponse("sizeId is required!", {
        status: 400,
      });
    }

    // TODO: Check if is products linked before delete the size

    // Checks if the logged-in user owns the 'storeId' store. To prevent sizes being deleted in stores that are not owned.
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      // If the user is trying to change a store that is not theirs, throw error 403
      return new NextResponse("Unauthorized", {
        status: 403,
      });
    }

    // Delete the size(s)
    const size = await prismadb.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    // TODO: Stop using console.log and switch to a logging service
    console.log("[SIZE_DELETE]: ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
