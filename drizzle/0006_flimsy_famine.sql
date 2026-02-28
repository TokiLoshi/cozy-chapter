CREATE TYPE "public"."light_preference" AS ENUM('low', 'medium', 'brightIndirect', 'brightDirect');--> statement-breakpoint
ALTER TABLE "userAudiobooks" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "plants" ADD COLUMN "name" text;--> statement-breakpoint
ALTER TABLE "plants" ADD COLUMN "lightPreferences" "light_preference";--> statement-breakpoint
ALTER TABLE "plants" ADD COLUMN "plantImageUrl" text;