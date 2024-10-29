CREATE TYPE "public"."roles" AS ENUM('user', 'admin');--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "role" TO "roles";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "roles" SET DATA TYPE roles;