/*
  Warnings:

  - You are about to drop the column `facebookLink` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `instagramLink` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "facebookLink",
DROP COLUMN "instagramLink",
ADD COLUMN     "discordLink" TEXT;
