/*
  Warnings:

  - You are about to drop the column `adminId` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `details` on the `Complaint` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Complaint" DROP CONSTRAINT "Complaint_adminId_fkey";

-- AlterTable
ALTER TABLE "public"."Complaint" DROP COLUMN "adminId",
DROP COLUMN "details";
