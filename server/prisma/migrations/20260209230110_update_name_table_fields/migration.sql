-- AlterTable
-- Add new columns: first_name, last_name, class, section
ALTER TABLE "public"."Name" ADD COLUMN "first_name" TEXT NOT NULL DEFAULT '';
ALTER TABLE "public"."Name" ADD COLUMN "last_name" TEXT NOT NULL DEFAULT '';
ALTER TABLE "public"."Name" ADD COLUMN "class" TEXT NOT NULL DEFAULT '';
ALTER TABLE "public"."Name" ADD COLUMN "section" TEXT NOT NULL DEFAULT '';

-- Drop the old "name" column
ALTER TABLE "public"."Name" DROP COLUMN "name";

