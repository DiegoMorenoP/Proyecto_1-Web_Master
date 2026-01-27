-- Seed Data for Solar E-commerce MVP
-- Populates: Products, Kits, Kit Items, Leads, Simulations
-- Usage: psql -h localhost -p 54322 -U postgres -d postgres -f supabase/seed.sql
-- Or via Supabase CLI: npx supabase db reset (re-applies migrations and this seed)

BEGIN;

-- 1. CLEANUP
TRUNCATE TABLE "public"."kit_items" CASCADE;
TRUNCATE TABLE "public"."simulations" CASCADE;
TRUNCATE TABLE "public"."kits" CASCADE;
TRUNCATE TABLE "public"."products" CASCADE;
TRUNCATE TABLE "public"."leads" CASCADE;

-- 2. PRODUCTS (Panels, Inverters, Batteries) - ~20 Items
WITH new_products AS (
    INSERT INTO "public"."products" (name, type, price, voltage, stock_status, image_url, tech_spec_pdf, stock) VALUES 
    -- Panels
    ('SunPower Maxeon 6 AC', 'panel', 420.00, 50, 'in_stock', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80', 'specs_maxeon6.pdf', 150),
    ('Longi Hi-MO 5m 540W', 'panel', 245.00, 42, 'in_stock', 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=800&q=80', 'specs_himo5.pdf', 85),
    ('Jinko Solar Tiger Neo', 'panel', 260.00, 44, 'in_stock', 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80', 'specs_tiger.pdf', 200),
    ('Canadian Solar BiHiKu7', 'panel', 280.00, 45, 'low_stock', 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6f?auto=format&fit=crop&w=800&q=80', 'specs_bihiku7.pdf', 8),
    ('Trina Solar Vertex S+', 'panel', 230.00, 40, 'out_of_stock', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80', 'specs_vertex.pdf', 0),
    ('REC Alpha Pure-R', 'panel', 390.00, 48, 'in_stock', 'https://images.unsplash.com/photo-1624397640148-949b1732bb0a?auto=format&fit=crop&w=800&q=80', 'specs_rec.pdf', 45),
    ('Qcells Q.PEAK DUO', 'panel', 310.00, 43, 'in_stock', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80', 'specs_qcells.pdf', 60),
    
    -- Inverters
    ('Huawei SUN2000-5KTL', 'inverter', 1200.00, NULL, 'in_stock', 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&w=800&q=80', 'specs_huawei.pdf', 25),
    ('Fronius Primo 5.0-1', 'inverter', 1450.00, NULL, 'in_stock', 'https://images.unsplash.com/photo-1542336391-ae2936d8efe4?auto=format&fit=crop&w=800&q=80', 'specs_fronius.pdf', 18),
    ('SMA Sunny Boy 5.0', 'inverter', 1350.00, NULL, 'low_stock', 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80', 'specs_sma.pdf', 4),
    ('SolarEdge SE5000H', 'inverter', 1600.00, NULL, 'in_stock', 'https://images.unsplash.com/photo-1624397640148-949b1732bb0a?auto=format&fit=crop&w=800&q=80', 'specs_solaredge.pdf', 30),
    ('Growatt MIN 5000TL-X', 'inverter', 950.00, NULL, 'in_stock', 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&w=800&q=80', 'specs_growatt.pdf', 50),
    
    -- Batteries
    ('Tesla Powerwall 2', 'battery', 8500.00, 48, 'in_stock', 'https://images.unsplash.com/photo-1569024733183-40533e4b0930?auto=format&fit=crop&w=800&q=80', 'specs_powerwall.pdf', 12),
    ('LG Chem RESU 10H', 'battery', 6800.00, 400, 'low_stock', 'https://images.unsplash.com/photo-1569024733183-40533e4b0930?auto=format&fit=crop&w=800&q=80', 'specs_lgchem.pdf', 3),
    ('BYD Battery-Box Premium', 'battery', 5200.00, 48, 'in_stock', 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80', 'specs_byd.pdf', 15),
    ('Pylontech US3000C', 'battery', 1500.00, 48, 'in_stock', 'https://images.unsplash.com/photo-1542336391-ae2936d8efe4?auto=format&fit=crop&w=800&q=80', 'specs_pylon.pdf', 40),
    ('Huawei LUNA2000', 'battery', 4500.00, 360, 'out_of_stock', 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&w=800&q=80', 'specs_luna.pdf', 0)
    
    RETURNING id, name, type
),

-- 3. KITS (Combinations) - ~15 items
new_kits AS (
    INSERT INTO "public"."kits" (name, type, total_power, price, monthly_finance_cost, description, image_url, stock) VALUES
    ('Starter Eco Kit (3kW)', 'grid', 3.0, 4500.00, 45.00, 'Ideal for small apartments or couples. Includes essential panels and efficient inverter.', 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b0?auto=format&fit=crop&w=800&q=80', 5),
    ('Family Balance Kit (5kW)', 'grid', 5.0, 6800.00, 65.00, 'Perfect for standard families (3-4 people). Covers AC, laundry, and daily appliances.', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80', 8),
    ('Pro Autonomy Pack (8kW)', 'hybrid', 8.0, 12500.00, 120.00, 'Designed for large homes. Includes battery storage for night usage.', 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=800&q=80', 12),
    ('Off-Grid Cabin Essential', 'isolated', 2.5, 5900.00, 58.00, 'Complete independence for remote locations. Heavy-duty batteries included.', 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80', 3),
    ('Enterprise Solution (15kW)', 'grid', 15.0, 18900.00, 190.00, 'High efficiency for small businesses or large villas.', 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b0?auto=format&fit=crop&w=800&q=80', 10),
    ('Tesla Powerwall Bundle', 'hybrid', 6.0, 15500.00, 155.00, 'Premium Tesla backup solution with seamless grid integration.', 'https://images.unsplash.com/photo-1569024733183-40533e4b0930?auto=format&fit=crop&w=800&q=80', 4),
    ('Budget Friendly 4kW', 'grid', 4.0, 5200.00, 55.00, 'Maximum value for money. Tier 1 panels with standard inverter.', 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80', 15),
    ('High Efficiency 6kW', 'grid', 6.0, 8900.00, 85.00, 'Uses high-efficiency Maxeon panels for limited roof spaces.', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80', 6),
    ('Hybrid Plus Storage', 'hybrid', 7.5, 13800.00, 135.00, '7.5kW hybrid system with 10kWh storage capacity.', 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=800&q=80', 7),
    ('Micro-Inverter System', 'grid', 4.5, 7200.00, 72.00, 'Optimized performance for shaded roofs using micro-inverters.', 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80', 9),
    ('Ultimate Independence', 'isolated', 10.0, 22000.00, 250.00, 'Zero grid reliance. Massive storage and generation capacity.', 'https://images.unsplash.com/photo-1542336391-ae2936d8efe4?auto=format&fit=crop&w=800&q=80', 5),
    ('Urban Compact Kit', 'grid', 2.0, 3200.00, 35.00, 'Designed for city balconies and small terraced houses.', 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b0?auto=format&fit=crop&w=800&q=80', 11),
    ('Smart Home Solar', 'hybrid', 5.0, 11000.00, 110.00, 'Integrated with smart home energy manager.', 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&w=800&q=80', 8),
    ('Agricultural Pump Kit', 'isolated', 4.0, 6500.00, 65.00, 'Specialized for running water pumps in remote fields.', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80', 6),
    ('Weekend Cabin Kit', 'isolated', 1.5, 2500.00, 25.00, 'Small system for lighting and fridge during weekends.', 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80', 10)

    RETURNING id, name, price
),

-- 4. KIT ITEMS (Linking Kits to Products)
kit_composition AS (
    INSERT INTO "public"."kit_items" (kit_id, product_id, quantity)
    SELECT 
        k.id as kit_id,
        p.id as product_id,
        CASE 
            WHEN p.type = 'panel' THEN floor(random() * 10 + 4)::int
            WHEN p.type = 'inverter' THEN 1
            WHEN p.type = 'battery' THEN floor(random() * 2 + 1)::int
            ELSE 1
        END as quantity
    FROM new_kits k
    JOIN new_products p ON (
        (k.name LIKE '%Eco%' AND p.name LIKE '%Longi%') OR
        (k.name LIKE '%Plus%' AND p.name LIKE '%Trina%') OR
        (k.name LIKE '%Pro%' AND p.name LIKE '%SunPower%') OR
        (p.type = 'inverter' AND p.name LIKE '%Huawei%' AND k.name LIKE '%Kit%') OR
        (p.type = 'inverter' AND p.name LIKE '%Fronius%' AND k.name LIKE '%Pack%') OR
        (p.type = 'battery' AND k.name LIKE '%Autonomy%') OR
        (p.type = 'battery' AND k.name LIKE '%Tesla%')
    )
    ON CONFLICT DO NOTHING
),

-- 5. LEADS - ~20 Items
new_leads AS (
    INSERT INTO "public"."leads" (email, address, monthly_bill, roof_type) VALUES
    ('diego@example.com', 'Calle Mayor 123, Madrid', 120.50, 'flat'),
    ('maria.garcia@gmail.com', 'Av. Diagonal 45, Barcelona', 85.00, 'tiled'),
    ('john.doe@techcorp.com', '10 Downing St, London', 350.00, 'slate'),
    ('sarah.connor@sky.net', 'Desert Rd 99, California', 450.00, 'metal'),
    ('customer1@demo.com', 'Urbanizacion Sol 4, Sevilla', 95.00, 'tiled'),
    ('solar.fan@energy.org', 'Eco Village 12, Valencia', 110.00, 'flat'),
    ('business@shop.com', 'Poligono Ind. Norte, Bilbao', 900.00, 'metal'),
    ('farm.owner@field.es', 'Carretera N-340 km 20, Murcia', 150.00, 'other'),
    ('penthouse@luxury.com', 'Gran Via 1, Madrid', 200.00, 'flat'),
    ('beach.house@costa.com', 'Paseo Maritimo 55, Malaga', 75.00, 'tiled'),
    ('mountain.refuge@peaks.com', 'Sendero Alto 3, Huesca', 40.00, 'slate'),
    ('test.user.1@gmail.com', 'Calle Falsa 123, Springfield', 100.00, 'shingle'),
    ('innovator@startup.io', 'Tech Park Hub, Barcelona', 250.00, 'glass'),
    ('family.smith@yahoo.com', 'Suburban Lane 8, Liverpool', 130.00, 'tiled'),
    ('green.energy@future.com', 'Solar Ave 2050, Berlin', 80.00, 'solar_tile'),
    ('hotel.manager@resort.com', 'Playa Blanca 5 stars, Lanzarote', 2500.00, 'flat'),
    ('school.principal@edu.org', 'Carrera 7, Bogota', 600.00, 'concrete'),
    ('chef.restaurant@food.com', 'Rue de Paris 15, Lyon', 450.00, 'tile'),
    ('logistics@warehouse.com', 'Dock 4, Hamburg', 1200.00, 'metal'),
    ('artist@studio.com', 'Loft 42, New York', 180.00, 'flat')
    RETURNING id, email
)

-- 6. SIMULATIONS - Linking Leads to Recommended Kits
INSERT INTO "public"."simulations" (lead_id, recommended_kit_id, estimated_savings_year_1)
SELECT 
    l.id as lead_id,
    k.id as recommended_kit_id,
    (k.price * 0.15 + random() * 100)::numeric(10,2) as estimated_savings_year_1
FROM new_leads l
CROSS JOIN LATERAL (
    SELECT id, price FROM new_kits 
    ORDER BY random() 
    LIMIT 1
) k;

COMMIT;
