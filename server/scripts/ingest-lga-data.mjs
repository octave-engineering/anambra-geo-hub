#!/usr/bin/env node

/**
 * LGA Data Ingestion Script
 * 
 * This script creates the dim_lga table and ingests LGA data from CSV
 * Excludes 'leaf' column and adds 'ingested_at' timestamp
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
import pg from 'pg';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const { Pool } = pg;

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'anambra_geohub',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false },
});

const CSV_FILE_PATH = path.resolve(__dirname, '../../../etl/data/organisation_units/lga_list.csv');

/**
 * Create the dim_lga table with all columns except 'leaf'
 */
async function createLGATable() {
  const createTableSQL = `
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
  `;

  try {
    console.log('🗄️  Creating dim_lga table...');
    await pool.query(createTableSQL);
    console.log('✅ dim_lga table created successfully');
  } catch (error) {
    console.error('❌ Error creating dim_lga table:', error);
    throw error;
  }
}

/**
 * Read and parse CSV file
 */
function readCSVFile() {
  return new Promise((resolve, reject) => {
    const results = [];
    
    console.log('📖 Reading CSV file:', CSV_FILE_PATH);
    
    if (!fs.existsSync(CSV_FILE_PATH)) {
      reject(new Error(`CSV file not found: ${CSV_FILE_PATH}`));
      return;
    }

    fs.createReadStream(CSV_FILE_PATH)
      .pipe(csv())
      .on('data', (data) => {
        // Exclude the 'leaf' column and clean up the data
        const cleanData = {
          id: data.id?.trim(),
          ancestors_ids: data.ancestors_ids?.trim(),
          children: data.children?.trim(),
          children_ids: data.children_ids?.trim(),
          dataSets_ids: data.dataSets_ids?.trim(),
          geometry_coordinates: data.geometry_coordinates?.trim(),
          geometry_type: data.geometry_type?.trim(),
          parent_id: data.parent_id?.trim(),
          path: data.path?.trim(),
          shortName: data.shortName?.trim()
        };
        
        // Only include rows that have an ID and shortName (actual LGAs)
        if (cleanData.id && cleanData.shortName && cleanData.shortName.includes('Local Government Area')) {
          results.push(cleanData);
        }
      })
      .on('end', () => {
        console.log(`📊 Found ${results.length} LGA records in CSV`);
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

/**
 * Insert LGA data into the database
 */
async function insertLGAData(lgaData) {
  const insertSQL = `
    INSERT INTO dim_lga (
      id, ancestors_ids, children, children_ids, dataSets_ids,
      geometry_coordinates, geometry_type, parent_id, path, shortName
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    ON CONFLICT (id) DO UPDATE SET
      ancestors_ids = EXCLUDED.ancestors_ids,
      children = EXCLUDED.children,
      children_ids = EXCLUDED.children_ids,
      dataSets_ids = EXCLUDED.dataSets_ids,
      geometry_coordinates = EXCLUDED.geometry_coordinates,
      geometry_type = EXCLUDED.geometry_type,
      parent_id = EXCLUDED.parent_id,
      path = EXCLUDED.path,
      shortName = EXCLUDED.shortName,
      ingested_at = CURRENT_TIMESTAMP
  `;

  console.log('💾 Inserting LGA data into database...');
  
  let insertedCount = 0;
  let updatedCount = 0;

  for (const lga of lgaData) {
    try {
      const result = await pool.query(insertSQL, [
        lga.id,
        lga.ancestors_ids || null,
        lga.children || null,
        lga.children_ids || null,
        lga.dataSets_ids || null,
        lga.geometry_coordinates || null,
        lga.geometry_type || null,
        lga.parent_id || null,
        lga.path || null,
        lga.shortName
      ]);
      
      if (result.rowCount > 0) {
        insertedCount++;
        console.log(`✅ Processed: ${lga.shortName}`);
      }
    } catch (error) {
      console.error(`❌ Error inserting LGA ${lga.shortName}:`, error.message);
    }
  }

  console.log(`🎉 Successfully processed ${insertedCount} LGA records`);
  return insertedCount;
}

/**
 * Verify the ingestion
 */
async function verifyIngestion() {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_lgas,
        COUNT(CASE WHEN geometry_coordinates IS NOT NULL THEN 1 END) as lgas_with_geometry,
        MIN(ingested_at) as first_ingested,
        MAX(ingested_at) as last_ingested
      FROM dim_lga
    `);
    
    const stats = result.rows[0];
    console.log('\n📈 Ingestion Summary:');
    console.log(`   Total LGAs: ${stats.total_lgas}`);
    console.log(`   LGAs with geometry: ${stats.lgas_with_geometry}`);
    console.log(`   First ingested: ${stats.first_ingested}`);
    console.log(`   Last ingested: ${stats.last_ingested}`);

    // Show sample LGAs
    const sampleResult = await pool.query(`
      SELECT id, shortName, geometry_type, ingested_at 
      FROM dim_lga 
      ORDER BY shortName 
      LIMIT 5
    `);
    
    console.log('\n📋 Sample LGAs:');
    sampleResult.rows.forEach(lga => {
      console.log(`   ${lga.shortname} (${lga.id}) - ${lga.geometry_type}`);
    });

  } catch (error) {
    console.error('❌ Error verifying ingestion:', error);
  }
}

/**
 * Update the facilities controller to use the new dim_lga table
 */
async function updateFacilitiesController() {
  const controllerPath = path.join(__dirname, '../controllers/facilities.controller.mjs');
  
  try {
    let content = fs.readFileSync(controllerPath, 'utf8');
    
    // Replace the getLGAs function to use dim_lga table
    const oldGetLGAs = /export const getLGAs = async \(req, res, next\) => \{[\s\S]*?\}\s*catch[\s\S]*?\}\s*\};/;
    
    const newGetLGAs = `export const getLGAs = async (req, res, next) => {
  try {
    const result = await pool.query(\`
      SELECT id as lga_id, shortName as lga_name 
      FROM dim_lga 
      WHERE shortName IS NOT NULL 
      ORDER BY shortName
    \`);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching LGAs:', error);
    next(error);
  }
};`;

    if (oldGetLGAs.test(content)) {
      content = content.replace(oldGetLGAs, newGetLGAs);
      fs.writeFileSync(controllerPath, content);
      console.log('✅ Updated facilities controller to use dim_lga table');
    } else {
      console.log('⚠️  Could not automatically update facilities controller - please update manually');
    }
  } catch (error) {
    console.error('❌ Error updating facilities controller:', error);
  }
}

/**
 * Main execution function
 */
async function main() {
  try {
    console.log('🚀 Starting LGA data ingestion...\n');
    
    // Step 1: Create the table
    await createLGATable();
    
    // Step 2: Read CSV data
    const lgaData = await readCSVFile();
    
    if (lgaData.length === 0) {
      throw new Error('No LGA data found in CSV file');
    }
    
    // Step 3: Insert data
    await insertLGAData(lgaData);
    
    // Step 4: Verify ingestion
    await verifyIngestion();
    
    // Step 5: Update controller
    await updateFacilitiesController();
    
    console.log('\n🎉 LGA data ingestion completed successfully!');
    console.log('   - Created dim_lga table with proper schema');
    console.log('   - Ingested all 21 LGAs from CSV');
    console.log('   - Added ingested_at timestamps');
    console.log('   - Updated API controller to use new table');
    console.log('\n💡 Next steps:');
    console.log('   1. Restart your backend server');
    console.log('   2. Test the LGA dropdown in the frontend');
    console.log('   3. Verify all 21 LGAs are now available');
    
  } catch (error) {
    console.error('💥 Error during LGA data ingestion:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the script
main();
