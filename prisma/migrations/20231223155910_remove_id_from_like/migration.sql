/*
  Warnings:

  - The primary key for the `like` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `like` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `like` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "like" DROP CONSTRAINT "like_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "like_userId_key" ON "like"("userId");
