
CREATE TABLE "users" (
"id" BIGINT PRIMARY KEY NOT NULL,
"github_id" TEXT NOT NULL,
"github_name" TEXT NOT NULL,
"price" TEXT NOT NULL,
"created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updated_at" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "cards" (
"id" BIGINT PRIMARY KEY NOT NULL,
"user_id" TEXT NOT NULL,
"title" TEXT NOT NULL,
"context" TEXT NOT NULL,
"card_price" TEXT NOT NULL,
"expire_time" TIMESTAMP(3) NOT NULL,
"created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updated_at" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "user_star" (
"id" BIGINT PRIMARY KEY NOT NULL,
"user_id" TEXT NOT NULL,
"card_id" TEXT NOT NULL,
"created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
);