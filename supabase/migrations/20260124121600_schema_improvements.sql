-- Migration: Schema Improvements (Standardization, Normalization, Optimization)
-- Date: 2026-01-24

-- 1. EXTENSIONS & FUNCTIONS
CREATE EXTENSION IF NOT EXISTS "moddatetime" WITH SCHEMA "extensions";

-- 2. SCHEMA STANDARDIZATION (Timestamps & Soft Deletes)

-- Add updated_at to tables if not exists
DO $$ 
BEGIN 
    -- kits
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kits' AND column_name = 'updated_at') THEN
        ALTER TABLE "public"."kits" ADD COLUMN "updated_at" TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
    -- products
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'updated_at') THEN
        ALTER TABLE "public"."products" ADD COLUMN "updated_at" TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
    -- leads
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'updated_at') THEN
        ALTER TABLE "public"."leads" ADD COLUMN "updated_at" TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
    -- simulations
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'simulations' AND column_name = 'updated_at') THEN
        ALTER TABLE "public"."simulations" ADD COLUMN "updated_at" TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
END $$;

-- Triggers for updated_at
CREATE OR REPLACE TRIGGER "handle_updated_at_kits"
BEFORE UPDATE ON "public"."kits"
FOR EACH ROW
EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

CREATE OR REPLACE TRIGGER "handle_updated_at_products"
BEFORE UPDATE ON "public"."products"
FOR EACH ROW
EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

CREATE OR REPLACE TRIGGER "handle_updated_at_leads"
BEFORE UPDATE ON "public"."leads"
FOR EACH ROW
EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

CREATE OR REPLACE TRIGGER "handle_updated_at_simulations"
BEFORE UPDATE ON "public"."simulations"
FOR EACH ROW
EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

-- Add deleted_at (Soft Delete)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kits' AND column_name = 'deleted_at') THEN
        ALTER TABLE "public"."kits" ADD COLUMN "deleted_at" TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'deleted_at') THEN
        ALTER TABLE "public"."products" ADD COLUMN "deleted_at" TIMESTAMPTZ;
    END IF;
END $$;


-- 3. RELATIONSHIP NORMALIZATION (Kit Composition)

CREATE TABLE IF NOT EXISTS "public"."kit_items" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "kit_id" "uuid" NOT NULL,
    "product_id" "uuid" NOT NULL,
    "quantity" integer DEFAULT 1 NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT "kit_items_pkey" PRIMARY KEY ("id")
);

-- Foreign Keys for kit_items
ALTER TABLE "public"."kit_items" 
    ADD CONSTRAINT "kit_items_kit_id_fkey" 
    FOREIGN KEY ("kit_id") 
    REFERENCES "public"."kits"("id") ON DELETE CASCADE;

ALTER TABLE "public"."kit_items" 
    ADD CONSTRAINT "kit_items_product_id_fkey" 
    FOREIGN KEY ("product_id") 
    REFERENCES "public"."products"("id") ON DELETE CASCADE;

-- Unique constraint to prevent duplicate product entries in the same kit
ALTER TABLE "public"."kit_items"
    ADD CONSTRAINT "kit_items_kit_id_product_id_key" UNIQUE ("kit_id", "product_id");

-- RLS for kit_items
ALTER TABLE "public"."kit_items" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public kit_items are viewable by everyone" ON "public"."kit_items" FOR SELECT USING (true);
GRANT ALL ON TABLE "public"."kit_items" TO "anon", "authenticated", "service_role";

-- 4. OPTIMIZATION (Indexes)

-- kit_items indexes
CREATE INDEX IF NOT EXISTS "kit_items_kit_id_idx" ON "public"."kit_items" ("kit_id");
CREATE INDEX IF NOT EXISTS "kit_items_product_id_idx" ON "public"."kit_items" ("product_id");

-- simulations indexes
CREATE INDEX IF NOT EXISTS "simulations_lead_id_idx" ON "public"."simulations" ("lead_id");
CREATE INDEX IF NOT EXISTS "simulations_recommended_kit_id_idx" ON "public"."simulations" ("recommended_kit_id");

-- leads indexes
CREATE INDEX IF NOT EXISTS "leads_email_idx" ON "public"."leads" ("email");
