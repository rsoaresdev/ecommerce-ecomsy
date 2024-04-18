import { createRouteHandler } from "uploadthing/next";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { utapi } from "@/server/uploadthing";

import { utFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: utFileRouter,
});

// Delete image from UploadThing
export async function DELETE(req: Request) {
  const body = await req.json();
  const urlPart = body.url.split("/"); // Splits the URL into parts using the slash as a delimiter
  const finalUrlPart = urlPart[urlPart.length - 1]; // Get the last part of the array

  try {
    await utapi.deleteFiles(finalUrlPart);
    return Response.json({
      message: "Image deletion attempt successfully sent",
    });
  } catch (error) {
    console.log("[UPLOADTHING_DELETE]: ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// Remove billboard field
export async function PATCH(req: Request) {
  const body = await req.json();

  try {
    await prismadb.billboard.updateMany({
      where: {
        imageUrl: body.url,
      },
      data: {
        imageUrl: "",
      },
    });
  } catch (error) {
    console.log("[UPLOADTHING_PATCH]: ", error);
    return new NextResponse("Internal error", { status: 500 });
  }

  return Response.json({ message: "imageUrl field flushed successfully" });
}
