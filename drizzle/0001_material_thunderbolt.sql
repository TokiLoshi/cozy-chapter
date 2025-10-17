CREATE TYPE "public"."article_status" AS ENUM('toRead', 'reading', 'completed', 'abandoned');--> statement-breakpoint
CREATE TABLE "articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"url" text,
	"author" text,
	"publishedDate" date,
	"description" text,
	"estimatedReadingTime" integer,
	"wordCount" integer,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"status" "article_status" DEFAULT 'toRead' NOT NULL,
	"notes" text,
	"highlights" jsonb DEFAULT '[]'::jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;