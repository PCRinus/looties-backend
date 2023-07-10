/*
  Warnings:

  - Added the required column `winning` to the `GameHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameHistory" ADD COLUMN     "winning" TEXT NOT NULL;
