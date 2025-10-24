ALTER TABLE "articles" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "status" SET DEFAULT 'toRead'::text;--> statement-breakpoint
DROP TYPE "public"."article_status";--> statement-breakpoint
CREATE TYPE "public"."article_status" AS ENUM('toRead', 'reading', 'read');--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "status" SET DEFAULT 'toRead'::"public"."article_status";--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "status" SET DATA TYPE "public"."article_status" USING "status"::"public"."article_status";--> statement-breakpoint
ALTER TABLE "articles" DROP COLUMN "publishedDate";--> statement-breakpoint
ALTER TABLE "articles" DROP COLUMN "tags";--> statement-breakpoint
ALTER TABLE "articles" DROP COLUMN "highlights";