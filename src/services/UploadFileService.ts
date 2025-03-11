import { prisma } from "../database/prisma";
import { generatePutPresignedUrl } from "../lib/cloudflare-r2";

interface UploadFileServiceParams {
  name: string;
  contentType: string;
  contentLength: number;
}

type UploadFileServiceResponse =
  | {
    type: "success";
    id: string;
    url: string;
  }
  | {
    type: "error";
    error: string;
  };

export class UploadFileService {
  async execute({
    name,
    contentType,
    contentLength,
  }: UploadFileServiceParams): Promise<UploadFileServiceResponse> {
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
