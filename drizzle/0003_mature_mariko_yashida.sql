ALTER TABLE `exercise` MODIFY COLUMN `filename` varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE `patients` ADD `name` varchar(64) DEFAULT 'missing';