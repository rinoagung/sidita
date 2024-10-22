/*
  Warnings:

  - You are about to alter the column `hours` on the `workinghours` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "workinghours" ALTER COLUMN "hours" SET DATA TYPE INTEGER;
