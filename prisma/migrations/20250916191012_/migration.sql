-- CreateEnum
CREATE TYPE "public"."UserTier" AS ENUM ('FREE', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "public"."Category" AS ENUM ('ECOMMERCE', 'FASHION', 'JEWELRY', 'TECHNOLOGY', 'BEAUTY');

-- CreateEnum
CREATE TYPE "public"."GenerationStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'TIMEOUT');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "imageUrl" TEXT,
    "tier" "public"."UserTier" NOT NULL DEFAULT 'FREE',
    "monthlyCredits" INTEGER NOT NULL DEFAULT 5,
    "creditsUsed" INTEGER NOT NULL DEFAULT 0,
    "creditResetAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Generation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" "public"."Category" NOT NULL,
    "modelImageUrl" TEXT,
    "productImageUrl" TEXT,
    "resultImageUrl" TEXT,
    "status" "public"."GenerationStatus" NOT NULL DEFAULT 'PENDING',
    "error" TEXT,
    "processingTime" INTEGER,
    "webhookPayload" JSONB,
    "webhookResponse" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Generation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "public"."User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_clerkId_idx" ON "public"."User"("clerkId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "Generation_userId_idx" ON "public"."Generation"("userId");

-- CreateIndex
CREATE INDEX "Generation_status_idx" ON "public"."Generation"("status");

-- CreateIndex
CREATE INDEX "Generation_createdAt_idx" ON "public"."Generation"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."Generation" ADD CONSTRAINT "Generation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
