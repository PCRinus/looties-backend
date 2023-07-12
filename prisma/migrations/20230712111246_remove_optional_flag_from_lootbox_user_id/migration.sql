/*
  Warnings:

  - Made the column `userId` on table `Lootbox` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Lootbox" DROP CONSTRAINT "Lootbox_userId_fkey";

-- AlterTable
ALTER TABLE "Lootbox" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Lootbox" ADD CONSTRAINT "Lootbox_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
