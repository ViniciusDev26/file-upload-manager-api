import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "../env";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const r2 = new S3Client({
  region: 'auto',
  endpoint: env.CLOUDFLARE_R2_HOST,
  credentials: {
    accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
  }
})

export const generateGetPresignedUrl = async (key: string) => {
  const url = await getSignedUrl(
    r2,
    new GetObjectCommand({
      Bucket: env.CLOUDFLARE_R2_BUCKET,
      Key: key,
    }),
    {
      expiresIn: 600,
    }
  )

  return { url }
}

interface GeneratePutPresignedUrlParams {
  key: string;
  contentType: string;
  contentLength?: number;
}
export const generatePutPresignedUrl = async ({key, contentType}: GeneratePutPresignedUrlParams) => {
  const url = await getSignedUrl(
    r2,
    new PutObjectCommand({
      Bucket: env.CLOUDFLARE_R2_BUCKET,
      Key: key,
      ContentType: contentType,
      ContentLength: 1024 * 1024
    }),
    {
      expiresIn: 600
    }
  )

  return { url }
}