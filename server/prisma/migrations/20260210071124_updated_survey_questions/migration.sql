/*
  Warnings:

  - You are about to drop the column `highest_math_course` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `preferred_language` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `programming_experience` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `used_vertical_division` on the `Questionnaire` table. All the data in the column will be lost.
  - Added the required column `highest_math_course` to the `Experiment_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_math_class_years` to the `Experiment_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preferred_language` to the `Experiment_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `school_year` to the `Experiment_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `study_major` to the `Experiment_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `used_vertical_division` to the `Experiment_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `years_programming` to the `Experiment_data` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Experiment_data" ADD COLUMN     "highest_math_course" TEXT NOT NULL,
ADD COLUMN     "last_math_class_years" TEXT NOT NULL,
ADD COLUMN     "preferred_language" TEXT NOT NULL,
ADD COLUMN     "school_year" TEXT NOT NULL,
ADD COLUMN     "study_major" TEXT NOT NULL,
ADD COLUMN     "used_vertical_division" TEXT NOT NULL,
ADD COLUMN     "years_programming" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Questionnaire" DROP COLUMN "highest_math_course",
DROP COLUMN "preferred_language",
DROP COLUMN "programming_experience",
DROP COLUMN "used_vertical_division";
