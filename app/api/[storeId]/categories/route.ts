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

    const { name, billboardId } = body;

    // If the user is not logged in, throw error 401
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // If the label parameter is not passed, throw error 400
    if (!name) {
      return new NextResponse("name is required!", {
        status: 400,
      });
    }

    // If the imageUrl parameter is not passed, throw error 400
    if (!billboardId) {
      return new NextResponse("billboardId is required!", {
        status: 400,
      });
    }

    if (!params.storeId) {
      // If the storeId parameter is not passed, throw error 400
      return new NextResponse("storeId is required!", {
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
      // If the user is trying to change a store/category that is not theirs, throw error 403
      return new NextResponse("Unauthorized", {
        status: 403,
      });
    }

    // Create a category
    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    // TODO: Stop using console.log and switch to a logging service
    console.log("[CATEGORIES_POST]: ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      // If the storeId parameter is not passed, throw error 400
      return new NextResponse("storeId is required!", {
        status: 400,
      });
    }

    // Get all categories
    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    // TODO: Stop using console.log and switch to a logging service
    console.log("[CATEGORIES_GET]: ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
