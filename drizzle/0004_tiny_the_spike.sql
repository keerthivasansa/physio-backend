CREATE TABLE `replies` (
	`reply` text,
	`patientId` varchar(64) NOT NULL,
	`day` int NOT NULL,
	CONSTRAINT `replies_day_patientId_pk` PRIMARY KEY(`day`,`patientId`)
);
