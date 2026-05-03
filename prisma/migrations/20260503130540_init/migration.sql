/*
  Warnings:

  - The `paymentMethod` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paymentMethods` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('CASH', 'CARD', 'BANK_TRANSFER', 'CHEQUE', 'OTHER');

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" "PaymentType" NOT NULL DEFAULT 'CASH';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "paymentMethods",
ADD COLUMN     "paymentMethods" "PaymentType"[];

-- DropEnum
DROP TYPE "PaymentMethod";
