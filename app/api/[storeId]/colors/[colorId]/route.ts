import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
  _req: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    // If the colorId parameter is not passed, throw error 400
    if (!params.colorId) {
      return new NextResponse("colorId is required!", {
        status: 400,
      });
    }

    // Get a color by their id
    const color = await prismadb.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    // TODO: Stop using console.log and switch to a logging service
    console.log("[COLOR_GET]: ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
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

    // If the colorId parameter is not passed, throw error 400
    if (!params.colorId) {
      return new NextResponse("colorId is required!", {
        status: 400,
      });
    }

    // Checks if the logged-in user owns the 'storeId' store. To prevent colors being updated in stores that are not owned.
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

    // Update the color(s)
    const color = await prismadb.color.updateMany({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    // TODO: Stop using console.log and switch to a logging service
    console.log("[COLOR_PATCH]: ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();

    // If the user is not logged in, throw error 401
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // If the colorId parameter is not passed, throw error 400
    if (!params.colorId) {
      return new NextResponse("colorId is required!", {
        status: 400,
      });
    }

    // TODO: Check if is products linked before delete the color

    // Checks if the logged-in user owns the 'storeId' store. To prevent colors being deleted in stores that are not owned.
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

    // Delete the color(s)
    const color = await prismadb.color.deleteMany({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    // TODO: Stop using console.log and switch to a logging service
    console.log("[COLOR_DELETE]: ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
