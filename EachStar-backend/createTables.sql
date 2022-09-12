CREATE TABLE "users" (
"id" BIGINT PRIMARY KEY NOT NULL,
"email" TEXT,
"email_verified" BOOLEAN NOT NULL DEFAULT false,
"username" TEXT NOT NULL,
"display_name" TEXT NOT NULL DEFAULT E'',
"password" TEXT NOT NULL DEFAULT E'',
"created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updated_at" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "user_external" (
"id" BIGINT PRIMARY KEY NOT NULL,
"user_id" TEXT NOT NULL,
"external_type" TEXT NOT NULL,
"external_id" TEXT NOT NULL,
"external_name" TEXT NOT NULL,
"created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updated_at" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "user_profile" (
"id" BIGINT PRIMARY KEY NOT NULL,
"user_id" TEXT NOT NULL,
"user_key" TEXT NOT NULL,
"user_profile" TEXT NOT NULL,
"created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updated_at" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "user_preference" (
"id" BIGINT PRIMARY KEY NOT NULL,
"user_id" TEXT NOT NULL,
"user_key" TEXT NOT NULL,
"user_preference" TEXT NOT NULL,
"created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updated_at" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "verification" (
"id" BIGINT PRIMARY KEY NOT NULL,
"user_id" TEXT NOT NULL,
"intent" TEXT NOT NULL,
"approach" TEXT NOT NULL,
"target" TEXT NOT NULL,
"code" TEXT NOT NULL,
"status" TEXT NOT NULL,
"expire_time" TIMESTAMP(3) NOT NULL,
"created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updated_at" TIMESTAMP(3) NOT NULL
);
