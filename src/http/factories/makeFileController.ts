import { GetFileByIdService } from "../../services/GetFileByIdService"
import { UploadFileService } from "../../services/UploadFileService"
import { FileController } from "../controllers/FileController"

export const makeFileController = () => {
  const getFileByIdService = new GetFileByIdService()
  const uploadFileService = new UploadFileService()
  const fileController = new FileController(getFileByIdService, uploadFileService)

  return fileController
}