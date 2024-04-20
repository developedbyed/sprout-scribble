ALTER TABLE "verificationToken" RENAME COLUMN "id" TO "identifier";--> statement-breakpoint
ALTER TABLE "verificationToken" DROP CONSTRAINT "verificationToken_token_unique";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'verificationToken'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "verificationToken" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "verificationToken" ADD CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token");--> statement-breakpoint
ALTER TABLE "verificationToken" DROP COLUMN IF EXISTS "email";