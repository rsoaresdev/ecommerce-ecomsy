import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body;

    // If the user is not logged in, throw error 401
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // If the name parameter is not passed, throw error 400
    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }
    // If the price parameter is not passed, throw error 400
    if (!price) new NextResponse("price is required", { status: 400 });

    // If the categoryId parameter is not passed, throw error 400
    if (!categoryId)
      new NextResponse("categoryId is required", { status: 400 });

    // If the colorId parameter is not passed, throw error 400
    if (!colorId) new NextResponse("colorId is required", { status: 400 });

    // If the sizeId parameter is not passed, throw error 400
    if (!sizeId) new NextResponse("sizeId is required", { status: 400 });

    // If the isFeatured parameter is not passed, throw error 400
    if (!isFeatured)
      new NextResponse("isFeatured is required", { status: 400 });

    // If the isArchived parameter is not passed, throw error 400
    if (!isArchived)
      new NextResponse("isArchived is required", { status: 400 });

    // If the images parameters is not passed, throw error 400
    if (!images || !images.length) {
      return new NextResponse("image(s) required", { status: 400 });
    }

    if (!params.storeId) {
      // If the storeId parameter is not passed, throw error 400
      return new NextResponse("storeId is required", { status: 400 });
    }

    // Checks if the logged-in user owns the 'storeId' store. To prevent products being created in stores that are not owned.
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      // If the user is trying to change a store that is not theirs, throw error 403
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Create the product
    const product = await prismadb.product.create({
      data: {
        name,
        images: {
          createMany: {
            data: images.map((url: string) => ({ url })),
          },
        },
        price,
        isFeatured,
        isArchived,
        categoryId,
        sizeId,
        colorId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    // TODO: Stop using console.log and switch to a logging service
    console.log("[PRODUCTS_POST]: ", error);
    return new NextResponse(`Internal error`, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    // Get data from url params
    const { searchParams } = new URL(req.url);
    // Extract data from searchParams
    const categoryId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId) {
      // If the storeId parameter is not passed, throw error 400
      return new NextResponse("storeId is required", { status: 400 });
    }

    // Get all products
    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    // TODO: Stop using console.log and switch to a logging service
    console.log("[PRODUCTS_GET]: ", error);
    return new NextResponse(`Internal error`, { status: 500 });
  }
}
