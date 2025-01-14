/*
  Warnings:

  - You are about to drop the column `end` on the `FocusedSessions` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `FocusedSessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FocusedSessions" DROP COLUMN "end",
DROP COLUMN "start",
ADD COLUMN     "endAt" TIMESTAMP(3),
ADD COLUMN     "startAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
