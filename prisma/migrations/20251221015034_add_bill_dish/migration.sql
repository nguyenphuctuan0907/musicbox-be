/*
  Warnings:

  - You are about to drop the `billdish` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `billdish` DROP FOREIGN KEY `BillDish_billId_fkey`;

-- DropForeignKey
ALTER TABLE `billdish` DROP FOREIGN KEY `BillDish_dishId_fkey`;

-- AlterTable
ALTER TABLE `bill` MODIFY `start` DATETIME(3) NULL,
    MODIFY `total` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `billdish`;

-- CreateTable
CREATE TABLE `bill_dish` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bill_id` INTEGER NOT NULL,
    `dish_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `price` INTEGER NOT NULL,

    INDEX `bill_dish_bill_id_idx`(`bill_id`),
    INDEX `bill_dish_dish_id_idx`(`dish_id`),
    UNIQUE INDEX `bill_dish_bill_id_dish_id_key`(`bill_id`, `dish_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bill_dish` ADD CONSTRAINT `BillDish_billId_fkey` FOREIGN KEY (`bill_id`) REFERENCES `Bill`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bill_dish` ADD CONSTRAINT `BillDish_dishId_fkey` FOREIGN KEY (`dish_id`) REFERENCES `Dish`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
