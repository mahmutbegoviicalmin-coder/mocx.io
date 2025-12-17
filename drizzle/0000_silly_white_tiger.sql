CREATE TABLE "claimed_trials" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"ip_hash" text NOT NULL,
	"user_agent" text,
	"claimed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"user_email" text,
	"message" text NOT NULL,
	"type" text DEFAULT 'bug',
	"status" text DEFAULT 'open',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "generations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"prompt" text NOT NULL,
	"image_url" text,
	"mode" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payout_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"user_email" text NOT NULL,
	"amount" text NOT NULL,
	"method" text NOT NULL,
	"details" text NOT NULL,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
