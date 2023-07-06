/*
  Warnings:

  - Added the required column `symbol` to the `Nfts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Nfts" ADD COLUMN     "symbol" TEXT NOT NULL;
