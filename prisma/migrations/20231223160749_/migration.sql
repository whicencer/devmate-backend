-- DropIndex
DROP INDEX "like_userId_key";

-- AlterTable
ALTER TABLE "like" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "like_pkey" PRIMARY KEY ("id");
