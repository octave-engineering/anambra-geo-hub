-- Create dim_lga table for proper LGA dimension data
-- This script creates the table structure for ingesting LGA data from CSV

-- Drop existing table if it exists
DROP TABLE IF EXISTS dim_lga CASCADE;

-- Create dim_lga table with all columns from CSV except 'leaf'
CREATE TABLE dim_lga (
    id VARCHAR(50) PRIMARY KEY,
    ancestors_ids TEXT,
    children TEXT,
    children_ids TEXT,
    dataSets_ids TEXT,
    geometry_coordinates TEXT,
    geometry_type VARCHAR(20),
    parent_id VARCHAR(50),
    path TEXT,
    shortName VARCHAR(255),
    ingested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_dim_lga_shortname ON dim_lga(shortName);
CREATE INDEX IF NOT EXISTS idx_dim_lga_parent_id ON dim_lga(parent_id);
CREATE INDEX IF NOT EXISTS idx_dim_lga_geometry_type ON dim_lga(geometry_type);
CREATE INDEX IF NOT EXISTS idx_dim_lga_ingested_at ON dim_lga(ingested_at);

-- Insert sample data (you can run the Node.js script to populate with full CSV data)
-- Or manually insert the 21 LGAs from the CSV file

-- Example insert (replace with actual data from CSV):
/*
INSERT INTO dim_lga (
    id, ancestors_ids, children, children_ids, dataSets_ids,
    geometry_coordinates, geometry_type, parent_id, path, shortName
) VALUES 
    ('kIIc6z1MTiT', 's5DPBsdoE8b,Nko8QFDmYmq', '', 'xAu14Zcm28y,EJb8TgcvVYN,...', 'AcdBK7oF06O,XpbmnAxeUA8,...', '[[[6.7691, 6.0595], ...]]', 'Polygon', 'Nko8QFDmYmq', '/s5DPBsdoE8b/Nko8QFDmYmq/kIIc6z1MTiT', 'Ogbaru Local Government Area'),
    -- Add all 21 LGAs here...
*/

-- Verify the table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'dim_lga' 
ORDER BY ordinal_position;

-- Check if data exists
SELECT COUNT(*) as total_lgas FROM dim_lga;
