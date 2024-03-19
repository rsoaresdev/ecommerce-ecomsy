import { generateUploadDropzone } from "@uploadthing/react";

import type { FileRouter } from "@/app/api/uploadthing/core";

export const UploadDropzone = generateUploadDropzone<FileRouter>();
