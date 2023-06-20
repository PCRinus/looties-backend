/*
  Warnings:

  - A unique constraint covering the columns `[referralCode]` on the table `Affiliates` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Affiliates_referralCode_key" ON "Affiliates"("referralCode");
