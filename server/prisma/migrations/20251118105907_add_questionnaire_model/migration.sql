-- CreateTable
CREATE TABLE "public"."Questionnaire" (
    "id" SERIAL NOT NULL,
    "experiment_data_id" INTEGER NOT NULL,
    "easier_form" TEXT,
    "easier_form_thoughts" TEXT,
    "used_calculator" BOOLEAN,
    "used_scratch_paper" BOOLEAN,
    "difficulty_rating" INTEGER,
    "programming_experience" BOOLEAN,
    "preferred_language" TEXT,
    "highest_math_course" TEXT,
    "used_vertical_division" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Questionnaire_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Questionnaire_experiment_data_id_key" ON "public"."Questionnaire"("experiment_data_id");

-- AddForeignKey
ALTER TABLE "public"."Questionnaire" ADD CONSTRAINT "Questionnaire_experiment_data_id_fkey" FOREIGN KEY ("experiment_data_id") REFERENCES "public"."Experiment_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;
