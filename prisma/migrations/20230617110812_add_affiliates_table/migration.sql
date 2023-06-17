-- CreateTable
CREATE TABLE "Affiliates" (
    "id" TEXT NOT NULL,
    "referralCode" TEXT NOT NULL,
    "redeemedCount" INTEGER NOT NULL DEFAULT 0,
    "availableCommission" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Affiliates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Affiliates_referralCode_key" ON "Affiliates"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "Affiliates_userId_key" ON "Affiliates"("userId");

-- AddForeignKey
ALTER TABLE "Affiliates" ADD CONSTRAINT "Affiliates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
