-- CreateTable
CREATE TABLE "WheelPrize" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 10,
    "color" TEXT NOT NULL DEFAULT '#163b66',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WheelPrize_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WheelPrize_order_idx" ON "WheelPrize"("order");
