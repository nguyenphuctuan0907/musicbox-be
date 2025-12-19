-- CreateTable
CREATE TABLE `Bill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `start` DATETIME(3) NOT NULL,
    `end` DATETIME(3) NULL,
    `box_id` INTEGER NOT NULL,
    `creator_id` INTEGER NOT NULL,
    `time_used` INTEGER NOT NULL DEFAULT 0,
    `subtotal` INTEGER NOT NULL,
    `discount_amount` INTEGER NOT NULL DEFAULT 0,
    `discount_percent` DOUBLE NULL,
    `total` INTEGER NOT NULL,
    `status` ENUM('DRAFT', 'PAID', 'CANCELED') NOT NULL DEFAULT 'DRAFT',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `discountType` INTEGER NULL,

    INDEX `Bill_boxId_fkey`(`box_id`),
    INDEX `Bill_creatorId_fkey`(`creator_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BillDish` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bill_id` INTEGER NOT NULL,
    `dish_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,

    INDEX `BillDish_billId_fkey`(`bill_id`),
    INDEX `BillDish_dishId_fkey`(`dish_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Box` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `default_price_per_hour` INTEGER NOT NULL,
    `size` ENUM('SMALL', 'MEDIUM', 'LARGE') NOT NULL,
    `status` ENUM('AVAILABLE', 'OCCUPIED', 'MAINTENANCE') NOT NULL DEFAULT 'AVAILABLE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BoxPriceInterval` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `box_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NULL,
    `price_per_hour` INTEGER NOT NULL,
    `start_time` VARCHAR(191) NOT NULL,
    `end_time` VARCHAR(191) NOT NULL,
    `day_type` ENUM('NORMAL', 'WEEKEND', 'HOLIDAY') NOT NULL,
    `min_people` INTEGER NULL,
    `max_people` INTEGER NULL,
    `priority` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `BoxPriceInterval_boxId_fkey`(`box_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dish` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `type` ENUM('FOOD', 'DRINK', 'SNACK') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'USER') NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `password` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Bill` ADD CONSTRAINT `Bill_boxId_fkey` FOREIGN KEY (`box_id`) REFERENCES `Box`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bill` ADD CONSTRAINT `Bill_creatorId_fkey` FOREIGN KEY (`creator_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BillDish` ADD CONSTRAINT `BillDish_billId_fkey` FOREIGN KEY (`bill_id`) REFERENCES `Bill`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BillDish` ADD CONSTRAINT `BillDish_dishId_fkey` FOREIGN KEY (`dish_id`) REFERENCES `Dish`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BoxPriceInterval` ADD CONSTRAINT `BoxPriceInterval_boxId_fkey` FOREIGN KEY (`box_id`) REFERENCES `Box`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
