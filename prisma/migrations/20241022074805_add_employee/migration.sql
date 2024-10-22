/*
  Warnings:

  - You are about to drop the column `userId` on the `workinghours` table. All the data in the column will be lost.
  - Added the required column `password` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeId` to the `workinghours` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "workinghours" DROP CONSTRAINT "workinghours_userId_fkey";

-- DropIndex
DROP INDEX "workinghours_userId_idx";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "workinghours" DROP COLUMN "userId",
ADD COLUMN     "employeeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "workinghours_employeeId_idx" ON "workinghours"("employeeId");

-- AddForeignKey
ALTER TABLE "workinghours" ADD CONSTRAINT "workinghours_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
