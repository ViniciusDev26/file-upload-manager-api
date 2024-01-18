import { prisma } from "../database/prisma"
import { generateGetPresignedUrl, r2 } from "../lib/cloudflare-r2"

export class GetFileByIdService {
  async execute(id: string) {
    const file = await prisma.file.findUnique({
      where: {
        id
      }
    })
    if (!file) {
      return {
        error: "file not found"
      }
    }
  
    const { url } = await generateGetPresignedUrl(file.key)

    return { url }
  }
}