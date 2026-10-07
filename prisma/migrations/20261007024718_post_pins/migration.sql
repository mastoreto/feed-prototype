-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "pins" JSONB NOT NULL DEFAULT '[]';
