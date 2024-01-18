import { prisma } from "../database/prisma";
import { generatePutPresignedUrl } from "../lib/cloudflare-r2";

interface UploadFileServiceParams {
  name: string;
  contentType: string;
  contentLength: number;
}

export class UploadFileService {
  async execute({name, contentType, contentLength}: UploadFileServiceParams) {
    const key = `${Date.now()} - ${name}`
    const maxLength = 1024 * 1024 * 1024; // 1GB
    const allowedContentTypes = ["application/zip"];
    if (!allowedContentTypes.includes(contentType)) {
      return {
        error: "invalid content type"
      }
    }

    if(contentLength > maxLength) {
      return {
        error: "file too large"
      }
    }
  
    const { url } = await generatePutPresignedUrl({
      key,
      contentType
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
      id: fileRow.id,
      url,
    }
  }
}