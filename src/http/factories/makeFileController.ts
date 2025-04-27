import { FileService } from "../../services/FileService"
import { FileController } from "../controllers/FileController"

export const makeFileController = () => {
  const fileService = FileService()
  const fileController = FileController(fileService)

  return fileController
}