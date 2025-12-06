/*
  Warnings:

  - You are about to alter the column `status` on the `Box` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Enum(EnumId(2))`.
  - You are about to alter the column `day_type` on the `BoxPriceInterval` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(4))`.

*/
-- AlterTable
ALTER TABLE `Box` MODIFY `status` ENUM('AVAILABLE', 'OCCUPIED', 'MAINTENANCE') NOT NULL DEFAULT 'AVAILABLE';

-- AlterTable
ALTER TABLE `BoxPriceInterval` MODIFY `day_type` ENUM('FOOD', 'DRINK', 'SNACK') NOT NULL;
