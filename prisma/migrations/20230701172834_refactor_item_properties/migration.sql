/*
  Warnings:

  - You are about to drop the column `details` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `dropChance` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "details",
DROP COLUMN "dropChance",
ADD COLUMN     "amount" INTEGER,
ALTER COLUMN "price" DROP NOT NULL,
ALTER COLUMN "lowestPrice" DROP NOT NULL,
ALTER COLUMN "highestPrice" DROP NOT NULL;
