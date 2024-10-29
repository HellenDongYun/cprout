CREATE TABLE IF NOT EXISTS "email-tokens" (
	"identifier" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "email-tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
