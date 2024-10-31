CREATE TABLE IF NOT EXISTS "password-reset-tokes" (
	"id" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "password-reset-tokes_id_token_pk" PRIMARY KEY("id","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "two-factor-tokes" (
	"id" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "two-factor-tokes_id_token_pk" PRIMARY KEY("id","token")
);
--> statement-breakpoint
ALTER TABLE "email-tokens" RENAME COLUMN "identifier" TO "id";--> statement-breakpoint
ALTER TABLE "email-tokens" DROP CONSTRAINT "email-tokens_identifier_token_pk";--> statement-breakpoint
ALTER TABLE "email-tokens" ADD CONSTRAINT "email-tokens_id_token_pk" PRIMARY KEY("id","token");