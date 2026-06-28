-- DropIndex
DROP INDEX "WheelSpin_email_key";

-- CreateIndex
CREATE INDEX "WheelSpin_email_createdAt_idx" ON "WheelSpin"("email", "createdAt");
