/*
  Warnings:

  - You are about to drop the column `time_spent` on the `FocusedSessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FocusedSessions" DROP COLUMN "time_spent",
ADD COLUMN     "end" TIMESTAMP(3),
ADD COLUMN     "start" TIMESTAMP(3);
