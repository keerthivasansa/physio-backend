CREATE TABLE `users` (
	`id` varchar(64) NOT NULL,
	`name` text NOT NULL,
	`password` text NOT NULL,
	`isDoctor` boolean NOT NULL DEFAULT false,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
