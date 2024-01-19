import { prisma } from "../database/prisma";
import { generatePutPresignedUrl } from "../lib/cloudflare-r2";

interface UploadFileServiceParams {
  name: string;
  contentType: string;
  contentLength: number;
}

type UploadFileServiceResponse = {
  type: "success"
  id: string;
  url: string;
} | {
  type: "error"
  error: string;
}

export class UploadFileService {
  async execute({name, contentType, contentLength}: UploadFileServiceParams): Promise<UploadFileServiceResponse> {
    const key = `${Date.now()} - ${name}`
    const maxLength = 1024 * 1024 * 1024; // 1GB
    const allowedContentTypes = ["application/zip", "application/x-zip-compressed", "application/zip-compressed", "application/octet-stream", "application/x-rar-compressed", "application/rar", "application/x-rar", "application/x-tar", "application/x-7z-compressed", "application/x-gzip", "application/gzip", "application/x-bzip2", "application/x-bzip", "application/x-bz2", "application/x-bz", "application/x-tar", "application/x-compress"];
    if (!allowedContentTypes.includes(contentType)) {
      return {
        type: "error",
        error: "invalid content type"
      }
    }

    if(contentLength > maxLength) {
      return {
        type: "error",
        error: "file too large"
      }
    }
  
    const { url } = await generatePutPresignedUrl({
      key,
      contentType,
      contentLength
    })
  
    const fileRow = await prisma.file.create({
      data: {
        name,
        key,
        contentType,
        contentLength
      }
    })

    return {
      type: "success",
      id: fileRow.id,
      url,
    }
  }
}