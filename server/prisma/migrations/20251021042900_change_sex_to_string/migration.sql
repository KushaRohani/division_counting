/*
  Warnings:

  - Changed the type of `sex` on the `Experiment_data` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Experiment_data" DROP COLUMN "sex",
ADD COLUMN     "sex" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."Sex";
