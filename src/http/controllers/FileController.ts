import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { FileService } from "../../services/FileService/types";

export function FileController(fileService: FileService) {
  return {
    async getFileById(request: FastifyRequest, reply: FastifyReply) {
      const routeParamsSchema = z.object({
        id: z.string().cuid()
      })
      const { id } = routeParamsSchema.parse(request.params)
      const response = await fileService.get({ id });
  
      if(response.type === "error") {
        reply.code(404)
        return {
          error: response.error
        }
      }
  
      reply.redirect(response.url)
    },
    async upload(request: FastifyRequest) {
      const uploadSchema = z.object({
        name: z.string(),
        contentType: z.string().regex(/\w+\/[-+.\w]+/, "invalid content type"),
        contentLength: z.coerce.number()
      })
      const { name, contentType, contentLength } = uploadSchema.parse(request.body)
    
      const uploadResponse = await fileService.upload({
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
}