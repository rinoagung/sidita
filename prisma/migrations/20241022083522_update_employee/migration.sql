-- DropForeignKey
ALTER TABLE "workinghours" DROP CONSTRAINT "workinghours_employeeId_fkey";

-- AddForeignKey
ALTER TABLE "workinghours" ADD CONSTRAINT "workinghours_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
