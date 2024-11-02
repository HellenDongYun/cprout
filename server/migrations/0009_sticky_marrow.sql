ALTER TABLE "two-factor-tokes" ADD COLUMN "userID" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "two-factor-tokes" ADD CONSTRAINT "two-factor-tokes_userID_user_id_fk" FOREIGN KEY ("userID") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
