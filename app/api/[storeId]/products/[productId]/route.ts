import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { utapi } from "@/server/uploadthing";

export async function GET(
  _req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    // If the productId parameter is not passed, throw error 400
    if (!params.productId) {
      return new NextResponse("productId is required", { status: 400 });
    }

    // Get the specific product
    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    // TODO: Stop using console.log and switch to a logging service
    console.log("[PRODUCT_GET]: ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
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
      return new NextResponse("Image is required", { status: 400 });
    }

    if (!params.productId) {
      // If the productId parameter is not passed, throw error 400
      return new NextResponse("Product id is required", { status: 400 });
    }

    // Checks if the logged-in user owns the 'storeId' store. To prevent products being edited in stores that are not owned.
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

    // Update the product (delete all images)
    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        images: {
          deleteMany: {},
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

    // Append images to the product
    const product = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: images.map((url: string) => ({ url })),
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    // TODO: Stop using console.log and switch to a logging service
    console.log("[PRODUCT_PATCH]: ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();

    // If the user is not logged in, throw error 401
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // If the name productId is not passed, throw error 400
    if (!params.productId) {
      return new NextResponse("productId is required", { status: 400 });
    }

    // Checks if the logged-in user owns the 'storeId' store. To prevent products being deleted in stores that are not owned.
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

    // Get the product by ID
    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true, // Includes all images associated with the product
      },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Extracts the URLs of the images associated with the product
    const imageNames = product.images.map((image: { url: string }) => {
      const urlPart = image.url.split("/");
      return urlPart[urlPart.length - 1];
    });

    // Delete images from S3
    await utapi.deleteFiles(imageNames);

    // Delete the product
    await prismadb.product.deleteMany({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    // TODO: Stop using console.log and switch to a logging service
    console.log("[PRODUCT_DELETE]: ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
