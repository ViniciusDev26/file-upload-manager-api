import fastify from "fastify"
import { makeFileController } from "./factories/makeFileController"

const app = fastify()

const fileController = makeFileController()
app.get("/file/:id", fileController.getFileById.bind(fileController))
app.post("/file/upload", fileController.upload.bind(fileController))

app.listen({
  port: 3000,
  host: '0.0.0.0'
})