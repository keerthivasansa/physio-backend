ALTER TABLE `exercise` DROP PRIMARY KEY;
ALTER TABLE `exercise` MODIFY COLUMN `filename` varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE `exercise` ADD PRIMARY KEY(`day`,`doctorId`,`patientId`,`filename`);