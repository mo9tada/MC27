-- DropIndex
DROP INDEX "WheelPrize_order_idx";

-- DropIndex
DROP INDEX "WheelSpin_email_createdAt_idx";

-- AlterTable
ALTER TABLE "WheelPrize" ADD COLUMN     "wheel" TEXT NOT NULL DEFAULT 'store';

-- AlterTable
ALTER TABLE "WheelSpin" ADD COLUMN     "wheel" TEXT NOT NULL DEFAULT 'store';

-- CreateIndex
CREATE INDEX "WheelPrize_wheel_order_idx" ON "WheelPrize"("wheel", "order");

-- CreateIndex
CREATE INDEX "WheelSpin_wheel_email_createdAt_idx" ON "WheelSpin"("wheel", "email", "createdAt");
