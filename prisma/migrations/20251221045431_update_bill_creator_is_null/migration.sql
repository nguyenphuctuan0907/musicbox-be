-- DropForeignKey
ALTER TABLE `bill` DROP FOREIGN KEY `Bill_creatorId_fkey`;

-- AlterTable
ALTER TABLE `bill` MODIFY `creator_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Bill` ADD CONSTRAINT `Bill_creatorId_fkey` FOREIGN KEY (`creator_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
