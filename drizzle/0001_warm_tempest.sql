CREATE TABLE `dayEntry` (
	`date` date NOT NULL,
	`patientId` varchar(64) NOT NULL,
	`params` json,
	`remarks` text,
	CONSTRAINT `dayEntry_date_patientId_pk` PRIMARY KEY(`date`,`patientId`)
);
--> statement-breakpoint
CREATE TABLE `exercise` (
	`url` text NOT NULL,
	`patientId` varchar(64),
	CONSTRAINT `exercise_url` PRIMARY KEY(`url`)
);
--> statement-breakpoint
CREATE TABLE `patients` (
	`id` varchar(64) NOT NULL,
	`doctorId` varchar(64),
	`startDate` date,
	CONSTRAINT `patients_id` PRIMARY KEY(`id`)
);
