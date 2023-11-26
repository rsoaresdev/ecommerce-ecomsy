import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
  _req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    // If the billboardId parameter is not passed, throw error 400
    if (!params.billboardId) {
      return new NextResponse("billboardId is required!", {
        status: 400,
      });
    }

    // Get a billboard by their id
    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    // TODO: Stop using console.log and switch to a logging service
    console.log("[BILLBOARD_GET]: ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { label, imageUrl } = body;

    // If the user is not logged in, throw error 401
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // If the label parameter is not passed, throw error 400
    if (!label) {
      return new NextResponse("label' is required!", {
        status: 400,
      });
    }

    // If the imageUrl parameter is not passed, throw error 400
    if (!imageUrl) {
      return new NextResponse("imageUrl is required!", {
        status: 400,
      });
    }

    // If the billboardId parameter is not passed, throw error 400
    if (!params.billboardId) {
      return new NextResponse("billboardId is required!", {
        status: 400,
      });
    }

    // Checks if the logged-in user owns the 'storeId' store. To prevent billboards being updated in stores that are not owned.
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

    // Update the billboard(s)
    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    // TODO: Stop using console.log and switch to a logging service
    console.log("[BILLBOARD_PATCH]: ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();

    // If the user is not logged in, throw error 401
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // If the billboardId parameter is not passed, throw error 400
    if (!params.billboardId) {
      return new NextResponse("billboardId is required!", {
        status: 400,
      });
    }

    // Checks if the logged-in user owns the 'storeId' store. To prevent billboards being deleted in stores that are not owned.
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

    // Delete the billboard(s)
    const billboard = await prismadb.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    // TODO: Stop using console.log and switch to a logging service
    console.log("[BILLBOARD_DELETE]: ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
