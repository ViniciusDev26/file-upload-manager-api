export type FileService = {
  upload(params: UploadParams): Promise<UploadResponse>
  get(params: GetParams): Promise<GetResponse>
}
export type UploadParams = {
  name: string;
  contentType: string;
  contentLength: number;
}
export type UploadResponse =
  | {
    type: "success";
    id: string;
    url: string;
  }
  | {
    type: "error";
    error: string;
  };

export type GetParams = {
  id: string;
}
export type GetResponse =
  | {
    type: "success";
    url: string;
  }
  | {
    type: "error";
    error: string;
  };
