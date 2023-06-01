-- CreateTable
CREATE TABLE "LiveDrops" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "LiveDrops_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LiveDrops" ADD CONSTRAINT "LiveDrops_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
