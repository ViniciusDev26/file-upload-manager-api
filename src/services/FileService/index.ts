import { prisma } from "../../database/prisma";
import { generateGetPresignedUrl, generatePutPresignedUrl } from "../../lib/cloudflare-r2";
import { FileService, GetParams, GetResponse, UploadParams, UploadResponse } from "./types";

export function FileService(): FileService {
  return {
    async get({ id }: GetParams): Promise<GetResponse> {
      const file = await prisma.file.findUnique({
        where: {
          id,
        },
      });
      if (!file) {
        return {
          type: "error",
          error: "file not found",
        };
      }
  
      const { url } = await generateGetPresignedUrl(file.key);
  
      return {
        type: "success",
        url,
      };
    },
    async upload({ name, contentType, contentLength }: UploadParams): Promise<UploadResponse> {
        const key = `${Date.now()} - ${name}`;
    const maxLength = 1024 * 1024 * 1024; // 1GB

    if (contentLength > maxLength) {
      return {
        type: "error",
        error: "file too large",
      };
    }

    const { url } = await generatePutPresignedUrl({
      key,
      contentType,
      contentLength,
    });

    const fileRow = await prisma.file.create({
      data: {
        name,
        key,
        contentType,
        contentLength,
      },
    });

    return {
      type: "success",
      id: fileRow.id,
      url,
    };
    }
  }
}
