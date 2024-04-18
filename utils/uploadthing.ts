import { generateUploadDropzone } from "@uploadthing/react";

import type { utFileRouter } from "@/app/api/uploadthing/core";

export const UploadDropzone = generateUploadDropzone<utFileRouter>();
