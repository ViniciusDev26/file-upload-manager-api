import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import type { UploadFileService } from "../../services/UploadFileService";
import type { GetFileByIdService } from "../../services/GetFileByIdService";

export class FileController {
  constructor(
    private readonly getFileByIdService: GetFileByIdService,
    private readonly uploadFileService: UploadFileService
  ) {}

  async getFileById(request: FastifyRequest, reply: FastifyReply) {
    const routeParamsSchema = z.object({
      id: z.string().cuid()
    })
    const { id } = routeParamsSchema.parse(request.params)
    const response = await this.getFileByIdService.execute(id);

    if(response.type === "error") {
      reply.code(404)
      return {
        error: response.error
      }
    }

    reply.redirect(response.url)
  }

  async upload(request: FastifyRequest) {
    const uploadSchema = z.object({
      name: z.string(),
      contentType: z.string().regex(/\w+\/[-+.\w]+/, "invalid content type"),
      contentLength: z.coerce.number()
    })
    const { name, contentType, contentLength } = uploadSchema.parse(request.body)
  
    const uploadResponse = await this.uploadFileService.execute({
      name,
      contentType,
      contentLength,
    })

    if(uploadResponse.type === "error") {
      return {
        error: uploadResponse.error
      }
    }
  
    return {
      id: uploadResponse.id,
      url: uploadResponse.url
    }
  }
}