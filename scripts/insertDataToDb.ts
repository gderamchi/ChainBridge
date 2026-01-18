import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { Retailer } from './data/types/retailer';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY in environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


const filePath = path.join(process.cwd(), 'scripts/data/standardized_retailers.json');

async function insertData() {
  try {
    console.log(`Reading data from ${filePath}...`);
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const retailers: Retailer[] = JSON.parse(rawData);
    
    console.log(`Total records to insert: ${retailers.length}`);

    const BATCH_SIZE = 500;
    const totalBatches = Math.ceil(retailers.length / BATCH_SIZE);

    for (let i = 0; i < retailers.length; i += BATCH_SIZE) {
      const batch = retailers.slice(i, i + BATCH_SIZE);
      const currentBatchNum = Math.floor(i / BATCH_SIZE) + 1;

      // Map to snake_case strictly matching DB schema
      const preparedData = batch.map(r => ({
        english_name: r.englishName,
        name: r.name,
        category: r.category,
        country: r.country,
        contact: r.contact,
        exhibition: r.exhibition
      }));

      const { error } = await supabase.from('retailers').insert(preparedData);

      if (error) {
        console.error(`Error inserting batch ${currentBatchNum}/${totalBatches}:`, error);
        // Optionally break or continue based on severity. 
        // For a large script, typically you might want to log failed batches and continue, or stop.
        // I'll stop here to be safe and let user investigate.
        process.exit(1);
      } else {
        console.log(`Success: Batch ${currentBatchNum}/${totalBatches} inserted (${batch.length} records).`);
      }
    }

    console.log('All data inserted successfully.');

  } catch (err) {
    console.error('An unexpected error occurred:', err);
    process.exit(1);
  }
}

insertData();
