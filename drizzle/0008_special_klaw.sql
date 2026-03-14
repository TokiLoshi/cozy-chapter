CREATE TYPE "public"."movieStatus" AS ENUM('toWatch', 'watching', 'watched');--> statement-breakpoint
CREATE TYPE "public"."dietaryTag" AS ENUM('vegetarian', 'highProtein', 'plantProtein', 'meatProtein', 'pescatarian');--> statement-breakpoint
CREATE TYPE "public"."mealDay" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');--> statement-breakpoint
CREATE TYPE "public"."series" AS ENUM('toWatch', 'watching', 'watched');--> statement-breakpoint
CREATE TABLE "movies" (
	"id" text PRIMARY KEY NOT NULL,
	"imdbId" text,
	"title" text NOT NULL,
	"tagline" text,
	"originalLanguage" text,
	"externalUrl" text,
	"overview" text,
	"posterPath" text,
	"genreIds" jsonb,
	"runtime" integer,
	"releaseDate" timestamp,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "userMovies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"movieId" text NOT NULL,
	"status" "movieStatus" DEFAULT 'toWatch' NOT NULL,
	"watchingOn" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"startedAt" timestamp,
	"finishedAt" timestamp,
	"rating" integer,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "mealPlanEntries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mealPlanId" uuid NOT NULL,
	"recipeId" text NOT NULL,
	"day" "mealDay" NOT NULL,
	"cooked" boolean DEFAULT false NOT NULL,
	"cookedAt" timestamp,
	"rating" integer,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mealPlans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"name" text,
	"weekStartDate" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipeTags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipeId" text NOT NULL,
	"tag" "dietaryTag" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"userId" text NOT NULL,
	"description" text,
	"ingredients" jsonb,
	"cookingInstructions" jsonb,
	"source" text,
	"externalLink" text,
	"estimatedTime" text,
	"typicalTime" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "series" (
	"id" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userSeries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"seriesId" text NOT NULL,
	"status" "series" DEFAULT 'toWatch' NOT NULL,
	"season" integer,
	"episode" integer,
	"lastPosition" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "userMovies" ADD CONSTRAINT "userMovies_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userMovies" ADD CONSTRAINT "userMovies_movieId_movies_id_fk" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mealPlanEntries" ADD CONSTRAINT "mealPlanEntries_mealPlanId_mealPlans_id_fk" FOREIGN KEY ("mealPlanId") REFERENCES "public"."mealPlans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mealPlanEntries" ADD CONSTRAINT "mealPlanEntries_recipeId_recipes_id_fk" FOREIGN KEY ("recipeId") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mealPlans" ADD CONSTRAINT "mealPlans_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipeTags" ADD CONSTRAINT "recipeTags_recipeId_recipes_id_fk" FOREIGN KEY ("recipeId") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userSeries" ADD CONSTRAINT "userSeries_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userSeries" ADD CONSTRAINT "userSeries_seriesId_series_id_fk" FOREIGN KEY ("seriesId") REFERENCES "public"."series"("id") ON DELETE cascade ON UPDATE no action;