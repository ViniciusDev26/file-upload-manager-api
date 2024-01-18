/*
  Warnings:

  - You are about to drop the column `contentType` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `files` table. All the data in the column will be lost.
  - Added the required column `content_type` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "files" DROP COLUMN "contentType",
DROP COLUMN "createdAt",
ADD COLUMN     "content_type" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
