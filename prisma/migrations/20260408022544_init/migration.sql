-- CreateTable
CREATE TABLE "Corp" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "vmsInvest" INTEGER NOT NULL,
    "accInvest" INTEGER NOT NULL,
    "revenue" INTEGER NOT NULL,
    "hire" INTEGER NOT NULL,
    "chosenCount" INTEGER NOT NULL,
    "compareCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Corp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "corpId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Investor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Investor" ADD CONSTRAINT "Investor_corpId_fkey" FOREIGN KEY ("corpId") REFERENCES "Corp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
