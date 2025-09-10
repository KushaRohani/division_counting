/*
  Warnings:

  - You are about to drop the `Kusha_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Kusha_per_question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Marcos_Data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Marcos_per_question` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Kusha_data";

-- DropTable
DROP TABLE "public"."Kusha_per_question";

-- DropTable
DROP TABLE "public"."Marcos_Data";

-- DropTable
DROP TABLE "public"."Marcos_per_question";

-- DropEnum
DROP TYPE "public"."ProgrammingLanguage";

-- CreateTable
CREATE TABLE "public"."Name" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Name_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Experiment_data" (
    "id" SERIAL NOT NULL,
    "name_id" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "sex" "public"."Sex" NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "task_accuracy" BOOLEAN[],
    "task_ids" TEXT[],
    "total_time" INTEGER NOT NULL,
    "per_task_time" INTEGER[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Experiment_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Experiment_per_question" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "result" BOOLEAN NOT NULL,
    "time" INTEGER NOT NULL,

    CONSTRAINT "Experiment_per_question_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Experiment_data" ADD CONSTRAINT "Experiment_data_name_id_fkey" FOREIGN KEY ("name_id") REFERENCES "public"."Name"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
