import * as fs from 'fs';
import * as path from 'path';
import { type ExcelOutput } from './data/types/output.type';

function extractUniqueProductGroups(jsonPath: string): string[] {
  // Read and parse the JSON file
  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const data: ExcelOutput = JSON.parse(rawData);

  const productGroups = new Set<string>();

  // Loop through all sheets
  for (const sheet of data.sheets) {
    // Find the index of the "Product group" column
    // It could be named "Column_3" or have "Product group" in the header
    let productGroupKey: string | null = null;

    // Check if any header contains "Product group" or similar
    for (const header of sheet.headers) {
      if (header.toLowerCase().includes('product')) {
        productGroupKey = header;
        break;
      }
    }

    // Fallback: check if Column_3 exists (common pattern in this data)
    if (!productGroupKey && sheet.headers.includes('Column_3')) {
      productGroupKey = 'Column_3';
    }

    // Also check row values for product group data
    // Sometimes the header row is in the data rows
    for (const row of sheet.rows) {
      // Try to find product group from known keys
      const possibleKeys = ['Column_3', 'Product group', 'product group', productGroupKey].filter(Boolean);
      
      for (const key of possibleKeys) {
        if (key && row[key]) {
          const value = row[key];
          // Skip header-like values
          if (
            typeof value === 'string' &&
            value.trim() &&
            value !== 'Product group' &&
            value !== 'product group'
          ) {
            // Clean up the value (remove newlines, trim)
            const cleaned = value.replace(/\n/g, ' ').trim();
            if (cleaned) {
              productGroups.add(cleaned);
            }
          }
        }
      }
    }
  }

  // Convert to sorted array
  return Array.from(productGroups).sort();
}

function main() {
  const jsonPath = process.argv[2] || path.join(__dirname, 'sandbox', 'output.json');

  if (!fs.existsSync(jsonPath)) {
    console.error(`Error: File not found: ${jsonPath}`);
    process.exit(1);
  }

  console.log(`📄 Reading: ${jsonPath}\n`);

  const productGroups = extractUniqueProductGroups(jsonPath);

  console.log(`✅ Found ${productGroups.length} unique product groups:\n`);
  productGroups.forEach((group, index) => {
    console.log(`  ${index + 1}. ${group}`);
  });

  // Also save to a JSON file
  const outputPath = path.join(path.dirname(jsonPath), 'productGroups.json');
  fs.writeFileSync(outputPath, JSON.stringify(productGroups, null, 2), 'utf-8');
  console.log(`\n💾 Saved to: ${outputPath}`);
}

main();
