CREATE TABLE IF NOT EXISTS "email_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "email_tokens_id_token_pk" PRIMARY KEY("id","token")
);
--> statement-breakpoint
DROP TABLE "products";