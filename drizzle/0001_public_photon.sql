ALTER TABLE `patients` MODIFY COLUMN `doctorId` varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE `patients` MODIFY COLUMN `startDate` date NOT NULL;