-- CreateTable
CREATE TABLE "Affiliates" (
    "id" TEXT NOT NULL,
    "referralCode" TEXT NOT NULL,
    "redeemedCount" INTEGER NOT NULL DEFAULT 0,
    "totalWagered" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "availableCommission" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "referrerId" TEXT NOT NULL,
    "referredUserIds" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "Affiliates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Affiliates_referralCode_key" ON "Affiliates"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "Affiliates_referrerId_key" ON "Affiliates"("referrerId");

-- AddForeignKey
ALTER TABLE "Affiliates" ADD CONSTRAINT "Affiliates_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
