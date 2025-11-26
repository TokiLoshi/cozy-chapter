CREATE TYPE "public"."plant_health" AS ENUM('thriving', 'ok', 'needsAttention');--> statement-breakpoint
CREATE TABLE "plants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"species" text NOT NULL,
	"recommendedWateringIntervalDays" integer,
	"group" text,
	"lastWatered" timestamp,
	"plantHealth" "plant_health" DEFAULT 'thriving' NOT NULL,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "plants" ADD CONSTRAINT "plants_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;