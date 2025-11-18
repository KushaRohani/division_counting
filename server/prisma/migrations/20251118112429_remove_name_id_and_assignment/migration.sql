/*
  Warnings:

  - You are about to drop the column `name_id` on the `Experiment_data` table. All the data in the column will be lost.
  - You are about to drop the `Assignment` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Experiment_data" DROP COLUMN "name_id";

-- DropTable
DROP TABLE "public"."Assignment";
