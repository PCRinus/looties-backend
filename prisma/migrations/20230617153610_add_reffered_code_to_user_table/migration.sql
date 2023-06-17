/*
  Warnings:

  - You are about to drop the column `referredUserIds` on the `Affiliates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Affiliates" DROP COLUMN "referredUserIds";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "referralCode" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_referralCode_fkey" FOREIGN KEY ("referralCode") REFERENCES "Affiliates"("referralCode") ON DELETE SET NULL ON UPDATE CASCADE;
