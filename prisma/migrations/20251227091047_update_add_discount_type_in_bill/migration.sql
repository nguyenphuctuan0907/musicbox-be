/*
  Warnings:

  - You are about to alter the column `discountType` on the `bill` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `bill` MODIFY `discountType` ENUM('VND', 'PERCENT') NULL;
