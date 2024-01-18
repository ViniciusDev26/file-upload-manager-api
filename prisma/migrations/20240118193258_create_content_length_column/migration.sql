/*
  Warnings:

  - Added the required column `content_length` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "files" ADD COLUMN     "content_length" INTEGER NOT NULL;
