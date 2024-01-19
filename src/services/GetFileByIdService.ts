import { prisma } from "../database/prisma"
import { generateGetPresignedUrl, r2 } from "../lib/cloudflare-r2"

type GetFileByIdServiceResponse = {
  type: "success"
  url: string
} | {
  type: "error"
  error: string
}

export class GetFileByIdService {
  async execute(id: string): Promise<GetFileByIdServiceResponse> {
    const file = await prisma.file.findUnique({
      where: {
        id
      }
    })
    if (!file) {
      return {
        type: "error",
        error: "file not found"
      }
    }
  
    const { url } = await generateGetPresignedUrl(file.key)

    return { 
      type: "success",
      url
    }
  }
}