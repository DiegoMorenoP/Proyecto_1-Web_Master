-- Add stock and popularity_score to products table

DO $$
BEGIN
    -- Ensure stock column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'stock') THEN
        ALTER TABLE "public"."products" ADD COLUMN "stock" integer NOT NULL DEFAULT 0;
    END IF;

    -- Ensure popularity_score column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'popularity_score') THEN
        ALTER TABLE "public"."products" ADD COLUMN "popularity_score" numeric NOT NULL DEFAULT 0;
    END IF;

    -- Ensure stock column exists on kits
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kits' AND column_name = 'stock') THEN
        ALTER TABLE "public"."kits" ADD COLUMN "stock" integer NOT NULL DEFAULT 0;
    END IF;

    -- Ensure popularity_score column exists on kits
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kits' AND column_name = 'popularity_score') THEN
        ALTER TABLE "public"."kits" ADD COLUMN "popularity_score" numeric NOT NULL DEFAULT 0;
    END IF;
END $$;
