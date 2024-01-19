import fastify from "fastify"
import cors from "@fastify/cors"
import { makeFileController } from "./factories/makeFileController"

const app = fastify()
app.register(cors)

const fileController = makeFileController()
app.get("/file/:id", fileController.getFileById.bind(fileController))
app.post("/file/upload", fileController.upload.bind(fileController))

app.listen({
  port: 3000,
  host: '0.0.0.0'
})