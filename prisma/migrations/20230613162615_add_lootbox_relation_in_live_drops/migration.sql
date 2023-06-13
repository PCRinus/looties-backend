/*
  Warnings:

  - Added the required column `lootboxId` to the `LiveDrops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `LiveDrops` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LiveDrops" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lootboxId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "LiveDrops" ADD CONSTRAINT "LiveDrops_lootboxId_fkey" FOREIGN KEY ("lootboxId") REFERENCES "Lootbox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
