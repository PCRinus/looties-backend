/*
  Warnings:

  - You are about to drop the `Nft` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Nft";

-- CreateTable
CREATE TABLE "Nfts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Nfts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Nfts_name_key" ON "Nfts"("name");

-- AddForeignKey
ALTER TABLE "Nfts" ADD CONSTRAINT "Nfts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
