/*
  Warnings:

  - A unique constraint covering the columns `[mintAddress]` on the table `Nfts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mintAddress` to the `Nfts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Nfts" ADD COLUMN     "mintAddress" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Nfts_mintAddress_key" ON "Nfts"("mintAddress");
