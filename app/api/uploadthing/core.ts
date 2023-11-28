import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = () => {
  const { userId } = auth();
  console.log("Utilizador: ", userId);

  if (!userId) {
    throw new Error("Unauthorized");
  } else {
    return { userId };
  }
};

// FileRouter, can contain multiple FileRoutes
export const uploadThingFileRouter = {
  billboardImage: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type uploadThingFileRouter = typeof uploadThingFileRouter;
