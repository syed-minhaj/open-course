-- AlterTable
ALTER TABLE "_CartItems" ADD CONSTRAINT "_CartItems_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_CartItems_AB_unique";

-- AlterTable
ALTER TABLE "_Purchases" ADD CONSTRAINT "_Purchases_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_Purchases_AB_unique";

-- CreateIndex
CREATE INDEX "Course_creatorId_id_idx" ON "Course"("creatorId", "id");

-- CreateIndex
CREATE INDEX "Modules_courseId_id_idx" ON "Modules"("courseId", "id");
