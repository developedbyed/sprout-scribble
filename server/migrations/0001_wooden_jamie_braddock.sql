ALTER TABLE "user" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "password";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "twoFactorEnabled";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "roles";