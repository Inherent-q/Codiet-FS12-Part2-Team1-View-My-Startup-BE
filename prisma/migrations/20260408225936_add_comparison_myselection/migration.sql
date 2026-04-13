/*
  Warnings:

  - You are about to drop the column `chosenCount` on the `Corp` table. All the data in the column will be lost.
  - You are about to drop the column `compareCount` on the `Corp` table. All the data in the column will be lost.
  - You are about to drop the column `vmsInvest` on the `Corp` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Corp" DROP COLUMN "chosenCount",
DROP COLUMN "compareCount",
DROP COLUMN "vmsInvest";

-- CreateTable
CREATE TABLE "Comparisonselection" (
    "id" SERIAL NOT NULL,
    "userSessionId" TEXT NOT NULL,
    "corpId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comparisonselection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Myselection" (
    "id" SERIAL NOT NULL,
    "userSessionId" TEXT NOT NULL,
    "corpId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Myselection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comparisonselection" ADD CONSTRAINT "Comparisonselection_corpId_fkey" FOREIGN KEY ("corpId") REFERENCES "Corp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Myselection" ADD CONSTRAINT "Myselection_corpId_fkey" FOREIGN KEY ("corpId") REFERENCES "Corp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
