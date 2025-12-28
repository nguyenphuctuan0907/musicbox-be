-- AlterTable
ALTER TABLE `bill` ADD COLUMN `boxPriceInterval_id` INTEGER NULL;

-- CreateIndex
CREATE INDEX `Bill_boxPriceId_fkey` ON `Bill`(`boxPriceInterval_id`);

-- AddForeignKey
ALTER TABLE `Bill` ADD CONSTRAINT `Bill_boxPriceId_fkey` FOREIGN KEY (`boxPriceInterval_id`) REFERENCES `BoxPriceInterval`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
