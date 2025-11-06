import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'anambra_health',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false // Required for AWS RDS
  }
});

console.log('🔍 Testing database connection...\n');
console.log('Configuration:');
console.log(`  Host: ${pool.options.host}`);
console.log(`  Port: ${pool.options.port}`);
console.log(`  Database: ${pool.options.database}`);
console.log(`  User: ${pool.options.user}`);
console.log(`  Password: ${pool.options.password ? '***' : '(not set)'}\n`);

async function testConnection() {
  try {
    // Test basic connection
    console.log('1️⃣ Testing connection...');
    const client = await pool.connect();
    console.log('   ✅ Successfully connected to PostgreSQL!\n');
    
    // Test phc_facility table
    console.log('2️⃣ Checking phc_facility table...');
    const tableCheck = await client.query(`
      SELECT COUNT(*) as total,
             COUNT(CASE WHEN geom IS NOT NULL THEN 1 END) as with_coords
      FROM phc_facility
    `);
    
    const { total, with_coords } = tableCheck.rows[0];
    console.log(`   ✅ Table exists with ${total} facilities`);
    console.log(`   📍 ${with_coords} facilities have coordinates\n`);
    
    // Test sample query
    console.log('3️⃣ Testing sample query...');
    const sampleQuery = await client.query(`
      SELECT facility_id, facility_name, lga_name, ward_name
      FROM phc_facility
      WHERE geom IS NOT NULL
      LIMIT 3
    `);
    
    console.log(`   ✅ Retrieved ${sampleQuery.rows.length} sample facilities:`);
    sampleQuery.rows.forEach(row => {
      console.log(`      - ${row.facility_name} (${row.lga_name})`);
    });
    console.log('');
    
    // Test LGAs
    console.log('4️⃣ Checking available LGAs...');
    const lgaQuery = await client.query(`
      SELECT DISTINCT lga_name 
      FROM phc_facility 
      WHERE lga_name IS NOT NULL 
      ORDER BY lga_name
      LIMIT 5
    `);
    
    console.log(`   ✅ Found ${lgaQuery.rows.length} LGAs (showing first 5):`);
    lgaQuery.rows.forEach(row => {
      console.log(`      - ${row.lga_name}`);
    });
    console.log('');
    
    // Test GeoJSON conversion
    console.log('5️⃣ Testing GeoJSON conversion...');
    const geoJsonTest = await client.query(`
      SELECT ST_AsGeoJSON(geom)::json as geometry
      FROM phc_facility
      WHERE geom IS NOT NULL
      LIMIT 1
    `);
    
    console.log('   ✅ GeoJSON conversion working');
    console.log(`   Sample: ${JSON.stringify(geoJsonTest.rows[0].geometry).substring(0, 80)}...\n`);
    
    client.release();
    
    console.log('🎉 All tests passed! Database is ready for the map application.\n');
    console.log('Next steps:');
    console.log('  1. Run: npm run dev:full');
    console.log('  2. Open: http://localhost:5173/facility-map');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('  - Check your .env file has correct database credentials');
    console.error('  - Ensure PostgreSQL is running');
    console.error('  - Verify the phc_facility table exists');
    console.error('  - Check PostGIS extension is installed: CREATE EXTENSION IF NOT EXISTS postgis;');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testConnection();
