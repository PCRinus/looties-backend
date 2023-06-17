/*
  Warnings:

  - You are about to drop the column `referralCode` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_referralCode_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "referralCode",
ADD COLUMN     "affiliateId" TEXT,
ADD COLUMN     "redeemedCode" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
