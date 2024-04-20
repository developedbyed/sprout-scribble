CREATE TABLE IF NOT EXISTS "emailTokens" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "emailTokens_id_token_pk" PRIMARY KEY("id","token"),
	CONSTRAINT "emailTokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
DROP TABLE "verificationToken";