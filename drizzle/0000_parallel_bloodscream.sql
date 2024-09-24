CREATE TABLE `dayEntry` (
	`date` date NOT NULL,
	`patientId` varchar(64) NOT NULL,
	`params` json,
	`remarks` text,
	CONSTRAINT `dayEntry_date_patientId_pk` PRIMARY KEY(`date`,`patientId`)
);
--> statement-breakpoint
CREATE TABLE `exercise` (
	`filename` text NOT NULL,
	`patientId` varchar(64) NOT NULL,
	`doctorId` varchar(64) NOT NULL,
	`day` int NOT NULL,
	`exerciseNo` int NOT NULL,
	CONSTRAINT `exercise_day_doctorId_patientId_exerciseNo_pk` PRIMARY KEY(`day`,`doctorId`,`patientId`,`exerciseNo`)
);
--> statement-breakpoint
CREATE TABLE `patients` (
	`id` varchar(64) NOT NULL,
	`doctorId` varchar(64),
	`startDate` date,
	`totalDays` int NOT NULL,
	`age` int NOT NULL,
	CONSTRAINT `patients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(64) NOT NULL,
	`name` text NOT NULL,
	`password` text NOT NULL,
	`isDoctor` boolean NOT NULL DEFAULT false,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
