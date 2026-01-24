-- Ensure vital columns exist (Robustness fix)
-- This migration runs after auth_setup and schema_improvements

DO $$
BEGIN
    -- Ensure price column exists on products
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'price') THEN
        ALTER TABLE "public"."products" ADD COLUMN "price" numeric NOT NULL DEFAULT 0;
    END IF;

    -- Ensure price column exists on kits
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kits' AND column_name = 'price') THEN
        ALTER TABLE "public"."kits" ADD COLUMN "price" numeric NOT NULL DEFAULT 0;
    END IF;
    
    -- Ensure stock_status on products
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'stock_status') THEN
        -- We might need to cast or default if type exists, but assuming type exists from remote_schema
        ALTER TABLE "public"."products" ADD COLUMN "stock_status" "public"."stock_status" DEFAULT 'in_stock';
    END IF;

    -- Ensure voltage on products
     IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'voltage') THEN
        ALTER TABLE "public"."products" ADD COLUMN "voltage" numeric;
    END IF;
    
    -- Ensure tech_spec_pdf
     IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'tech_spec_pdf') THEN
        ALTER TABLE "public"."products" ADD COLUMN "tech_spec_pdf" text;
    END IF;

END $$;
