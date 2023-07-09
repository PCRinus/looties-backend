/*
  Warnings:

  - You are about to drop the column `dropChance` on the `Nfts` table. All the data in the column will be lost.
  - You are about to drop the column `lootboxId` on the `Nfts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Nfts" DROP CONSTRAINT "Nfts_lootboxId_fkey";

-- DropIndex
DROP INDEX "Nfts_lootboxId_key";

-- AlterTable
ALTER TABLE "Nfts" DROP COLUMN "dropChance",
DROP COLUMN "lootboxId";

-- CreateTable
CREATE TABLE "LootboxNfts" (
    "id" TEXT NOT NULL,
    "mintAddress" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "dropChance" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lootboxId" TEXT NOT NULL,

    CONSTRAINT "LootboxNfts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LootboxNfts_mintAddress_key" ON "LootboxNfts"("mintAddress");

-- CreateIndex
CREATE UNIQUE INDEX "LootboxNfts_name_key" ON "LootboxNfts"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LootboxNfts_lootboxId_key" ON "LootboxNfts"("lootboxId");

-- AddForeignKey
ALTER TABLE "LootboxNfts" ADD CONSTRAINT "LootboxNfts_lootboxId_fkey" FOREIGN KEY ("lootboxId") REFERENCES "Lootbox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
