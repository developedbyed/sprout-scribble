CREATE TABLE IF NOT EXISTS "verificationToken" (
	"id" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_id_token_pk" PRIMARY KEY("id","token")
);
