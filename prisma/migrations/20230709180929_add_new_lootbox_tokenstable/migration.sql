/*
  Warnings:

  - You are about to drop the column `dropChance` on the `Tokens` table. All the data in the column will be lost.
  - You are about to drop the column `lootboxId` on the `Tokens` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tokens" DROP CONSTRAINT "Tokens_lootboxId_fkey";

-- DropIndex
DROP INDEX "Tokens_lootboxId_key";

-- AlterTable
ALTER TABLE "Tokens" DROP COLUMN "dropChance",
DROP COLUMN "lootboxId";

-- CreateTable
CREATE TABLE "LootboxTokens" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "dropChance" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lootboxId" TEXT NOT NULL,

    CONSTRAINT "LootboxTokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LootboxTokens_lootboxId_key" ON "LootboxTokens"("lootboxId");

-- AddForeignKey
ALTER TABLE "LootboxTokens" ADD CONSTRAINT "LootboxTokens_lootboxId_fkey" FOREIGN KEY ("lootboxId") REFERENCES "Lootbox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
