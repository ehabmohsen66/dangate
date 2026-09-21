CREATE TABLE `consultations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`company` text DEFAULT '' NOT NULL,
	`job_title` text DEFAULT '' NOT NULL,
	`email` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`country` text NOT NULL,
	`service` text NOT NULL,
	`challenge` text NOT NULL,
	`ip_hash` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `consultation_rate_limit` ON `consultations` (`ip_hash`,`created_at`);