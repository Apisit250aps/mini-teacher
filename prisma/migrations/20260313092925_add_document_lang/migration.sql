/*
  Warnings:

  - A unique constraint covering the columns `[type,version,language]` on the table `documents` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "DocumentLanguage" AS ENUM ('EN', 'TH');

-- DropIndex
DROP INDEX "documents_type_version_key";

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "language" "DocumentLanguage" NOT NULL DEFAULT 'TH';

-- CreateIndex
CREATE UNIQUE INDEX "documents_type_version_language_key" ON "documents"("type", "version", "language");
