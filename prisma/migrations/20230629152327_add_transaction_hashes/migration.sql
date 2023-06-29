/*
  Warnings:

  - A unique constraint covering the columns `[hash]` on the table `Transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "hash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_hash_key" ON "Transactions"("hash");
