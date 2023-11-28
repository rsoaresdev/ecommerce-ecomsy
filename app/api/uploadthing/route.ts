import { createNextRouteHandler } from "uploadthing/next";
import { UTApi } from "uploadthing/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { uploadThingFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createNextRouteHandler({
  router: uploadThingFileRouter,
});

export async function DELETE(request: Request) {
  const data = await request.json();
  const newUrl = data.url.substring(data.url.lastIndexOf("/") + 1);
  const utapi = new UTApi();

  try {
    // Delete billboard from database
    await prismadb.billboard.updateMany({
      where: {
        imageUrl: data.url,
      },
      data: {
        imageUrl: "",
      },
    });

    // Delete image from UploadThing
    await utapi.deleteFiles(newUrl);
  } catch (error) {
    console.log("[UPLOADTHING_DELETE]: ", error);
    return new NextResponse("Internal error", { status: 500 });
  }

  return Response.json({ message: "ok" });
}
