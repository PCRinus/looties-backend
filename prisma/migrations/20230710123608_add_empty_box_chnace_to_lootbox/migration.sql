/*
  Warnings:

  - Added the required column `emptyBoxChance` to the `Lootbox` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lootbox" ADD COLUMN     "emptyBoxChance" DECIMAL(65,30) NOT NULL;
