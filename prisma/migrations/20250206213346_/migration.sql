/*
  Warnings:

  - The primary key for the `_CartItems` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_Purchases` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_CartItems` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_Purchases` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `indexInCourse` to the `Modules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Modules" ADD COLUMN     "indexInCourse" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "_CartItems" DROP CONSTRAINT "_CartItems_AB_pkey";

-- AlterTable
ALTER TABLE "_Purchases" DROP CONSTRAINT "_Purchases_AB_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "_CartItems_AB_unique" ON "_CartItems"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_Purchases_AB_unique" ON "_Purchases"("A", "B");
