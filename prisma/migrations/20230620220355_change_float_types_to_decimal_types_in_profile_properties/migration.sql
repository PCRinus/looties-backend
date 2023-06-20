/*
  Warnings:

  - You are about to alter the column `totalWagered` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `netProfit` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "totalWagered" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "netProfit" SET DATA TYPE DECIMAL(65,30);
