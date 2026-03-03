CREATE TYPE "public"."podcastSource" AS ENUM('spotify', 'youTube');--> statement-breakpoint
CREATE TYPE "public"."podcastStatus" AS ENUM('toListen', 'listening', 'listened');--> statement-breakpoint
CREATE TABLE "podcasts" (
	"id" text PRIMARY KEY NOT NULL,
	"showName" text,
	"episodeTitle" text NOT NULL,
	"description" text,
	"coverImageUrl" text,
	"durationMs" integer,
	"externalUrl" text,
	"source" "podcastSource" NOT NULL,
	"publishedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userPodcasts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"podcastId" text NOT NULL,
	"status" "podcastStatus" DEFAULT 'toListen' NOT NULL,
	"lastPositionMs" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"startedAt" timestamp,
	"finishedAt" timestamp,
	"rating" integer,
	"notes" text
);
--> statement-breakpoint
ALTER TABLE "userPodcasts" ADD CONSTRAINT "userPodcasts_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userPodcasts" ADD CONSTRAINT "userPodcasts_podcastId_podcasts_id_fk" FOREIGN KEY ("podcastId") REFERENCES "public"."podcasts"("id") ON DELETE cascade ON UPDATE no action;