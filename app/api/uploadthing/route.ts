import { createNextRouteHandler } from "uploadthing/next";
import { UTApi } from "uploadthing/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

import { uploadThingFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createNextRouteHandler({
  router: uploadThingFileRouter,
});

// Delete image billboard
export async function DELETE(request: Request) {
  const data = await request.json();
  const newUrl = data.url.substring(data.url.lastIndexOf("/") + 1);
  const utapi = new UTApi();

  try {
    // Search for the billboard image on the database
    const billboard = await prismadb.billboard.findMany({
      where: {
        imageUrl: data.url,
      },
    });

    /*
      Deletes the image from the S3, only if it is registered in the database.
      To handle the flow: Create billboard -> delete image -> delete billboard
    */
    if (billboard) {
      // Delete image from UploadThing
      await utapi.deleteFiles(newUrl);
    }
  } catch (error) {
    console.log("[UPLOADTHING_DELETE]: ", error);
    return new NextResponse("Internal error", { status: 500 });
  }

  return Response.json({ message: "ok" });
}

// Remove billboard field
export async function PATCH(request: Request) {
  const data = await request.json();

  try {
    await prismadb.billboard.updateMany({
      where: {
        imageUrl: data.url,
      },
      data: {
        imageUrl: "",
      },
    });
  } catch (error) {
    console.log("[UPLOADTHING_PATCH]: ", error);
    return new NextResponse("Internal error", { status: 500 });
  }

  return Response.json({ message: "ok" });
}
