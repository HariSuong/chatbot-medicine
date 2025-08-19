-- Step 1: Create the Company table
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Company_apiKey_key" ON "Company"("apiKey");

-- Step 2: Create a default company to assign existing data to
-- We will use a subquery later to get this ID, so we insert it first.
INSERT INTO "Company" ("id", "name", "apiKey", "updatedAt") VALUES (gen_random_uuid(), 'Default Company', gen_random_uuid(), NOW());

-- Step 3: Add the new "companyId" column to existing tables, but allow it to be NULL temporarily
ALTER TABLE "User" ADD COLUMN "companyId" TEXT;
ALTER TABLE "Consultant" ADD COLUMN "companyId" TEXT;
ALTER TABLE "Document" ADD COLUMN "companyId" TEXT;
ALTER TABLE "Appointment" ADD COLUMN "companyId" TEXT;

-- Step 4: Update all existing rows to point to the default company
-- This is the crucial step that prevents data loss.
UPDATE "User" SET "companyId" = (SELECT id FROM "Company" LIMIT 1);
UPDATE "Consultant" SET "companyId" = (SELECT id FROM "Company" LIMIT 1);
UPDATE "Document" SET "companyId" = (SELECT id FROM "Company" LIMIT 1);
UPDATE "Appointment" SET "companyId" = (SELECT id FROM "Company" LIMIT 1);

-- Step 5: Now that all rows have a value, make the "companyId" column required (NOT NULL)
ALTER TABLE "User" ALTER COLUMN "companyId" SET NOT NULL;
ALTER TABLE "Consultant" ALTER COLUMN "companyId" SET NOT NULL;
ALTER TABLE "Document" ALTER COLUMN "companyId" SET NOT NULL;
ALTER TABLE "Appointment" ALTER COLUMN "companyId" SET NOT NULL;

-- Step 6: Add the foreign key constraints to enforce the relationship
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Consultant" ADD CONSTRAINT "Consultant_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Document" ADD CONSTRAINT "Document_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
