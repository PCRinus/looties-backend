/*
  Warnings:

  - You are about to drop the column `method` on the `Transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "method",
ADD COLUMN     "coinsAmount" DECIMAL(65,30),
ADD COLUMN     "nftName" TEXT;
