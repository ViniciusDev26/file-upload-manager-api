import type { FastifyRequest } from "fastify";
import { z } from "zod";
import type { UploadFileService } from "../../services/UploadFileService";
import type { GetFileByIdService } from "../../services/GetFileByIdService";

export class FileController {
  constructor(
    private readonly getFileByIdService: GetFileByIdService,
    private readonly uploadFileService: UploadFileService
  ) {}

  async getFileById(request: FastifyRequest) {
    const routeParamsSchema = z.object({
      id: z.string().cuid()
    })
    const { id } = routeParamsSchema.parse(request.params)
    const { url } = await this.getFileByIdService.execute(id);

    return {
      url
    }
  }

  async upload(request: FastifyRequest) {
    const uploadSchema = z.object({
      name: z.string(),
      contentType: z.string().regex(/\w+\/[-+.\w]+/, "invalid content type"),
      contentLength: z.coerce.number()
    })
    const { name, contentType, contentLength } = uploadSchema.parse(request.body)
  
    const { url,id } = await this.uploadFileService.execute({
      name,
      contentType,
      contentLength,
    })
  
    return {
      id,
      url
    }
  }
}