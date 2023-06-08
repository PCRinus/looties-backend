/*
  Warnings:

  - You are about to drop the column `likes` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "likes",
ADD COLUMN     "likedBy" TEXT[],
ADD COLUMN     "repliedTo" TEXT;
