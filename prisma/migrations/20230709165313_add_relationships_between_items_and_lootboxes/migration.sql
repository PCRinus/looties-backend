/*
  Warnings:

  - A unique constraint covering the columns `[lootboxId]` on the table `Nfts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lootboxId]` on the table `Tokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lootboxId` to the `Nfts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lootboxId` to the `Tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lootbox" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Nfts" ADD COLUMN     "dropChance" DECIMAL(65,30),
ADD COLUMN     "lootboxId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tokens" ADD COLUMN     "dropChance" DECIMAL(65,30),
ADD COLUMN     "lootboxId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Nfts_lootboxId_key" ON "Nfts"("lootboxId");

-- CreateIndex
CREATE UNIQUE INDEX "Tokens_lootboxId_key" ON "Tokens"("lootboxId");

-- AddForeignKey
ALTER TABLE "Tokens" ADD CONSTRAINT "Tokens_lootboxId_fkey" FOREIGN KEY ("lootboxId") REFERENCES "Lootbox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nfts" ADD CONSTRAINT "Nfts_lootboxId_fkey" FOREIGN KEY ("lootboxId") REFERENCES "Lootbox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
