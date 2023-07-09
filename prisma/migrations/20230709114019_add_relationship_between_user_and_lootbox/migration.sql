-- AlterTable
ALTER TABLE "Lootbox" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Lootbox" ADD CONSTRAINT "Lootbox_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
