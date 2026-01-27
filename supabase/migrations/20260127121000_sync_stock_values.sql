
-- Update stock values to simulate realistic data
-- 20% chance of being out of stock
-- 80% chance of having 1-50 units

UPDATE kits 
SET stock = CASE 
    WHEN (id::text) LIKE '%a%' THEN 0 -- Deterministic randomness based on ID to avoid strict random() in migrations if preferred, but random() is fine for one-off
    ELSE floor(random() * 50 + 1)::int 
END;

-- Actually, let's use the random() logic as requested for randomness
UPDATE kits 
SET stock = CASE 
    WHEN random() < 0.2 THEN 0 
    ELSE floor(random() * 50 + 1)::int 
END;
