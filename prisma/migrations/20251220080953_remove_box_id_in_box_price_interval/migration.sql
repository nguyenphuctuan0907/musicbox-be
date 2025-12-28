/*
  Warnings:

  - You are about to drop the column `box_id` on the `boxpriceinterval` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `boxpriceinterval` DROP FOREIGN KEY `BoxPriceInterval_boxId_fkey`;

-- DropIndex
DROP INDEX `BoxPriceInterval_boxId_fkey` ON `boxpriceinterval`;

-- AlterTable
ALTER TABLE `boxpriceinterval` DROP COLUMN `box_id`;
