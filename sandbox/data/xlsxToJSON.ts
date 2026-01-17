import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

interface SheetData {
  sheetName: string;
  headers: string[];
  rows: Record<string, any>[];
}

interface ExcelOutput {
  fileName: string;
  sheetsCount: number;
  sheets: SheetData[];
  exportedAt: string;
}

function parseExcelToJSON(xlsxPath: string): ExcelOutput {
  // Read the workbook
  const workbook = XLSX.readFile(xlsxPath, {
    cellDates: true,
    cellNF: true,
    cellText: true,
  });

  const sheets: SheetData[] = [];

  // Loop through all sheets
  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      console.warn(`⚠ Skipping empty sheet: "${sheetName}"`);
      continue;
    }

    // Get sheet range
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

    // Extract headers (first row)
    const headers: string[] = [];
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: col });
      const cell = worksheet[cellAddress];
      headers.push(cell ? String(cell.v) : `Column_${col + 1}`);
    }

    // Convert to JSON with headers
    const rows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
      header: headers,
      range: 1, // Skip header row
      defval: null,
      raw: false,
    });

    sheets.push({
      sheetName,
      headers,
      rows,
    });

    console.log(`✓ Parsed sheet "${sheetName}": ${rows.length} rows, ${headers.length} columns`);
  }

  return {
    fileName: path.basename(xlsxPath),
    sheetsCount: sheets.length,
    sheets,
    exportedAt: new Date().toISOString(),
  };
}

function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: npx ts-node xlsxToJSON.ts <input.xlsx> <output.json>');
    console.error('');
    console.error('Arguments:');
    console.error('  input.xlsx   Path to the Excel file to convert');
    console.error('  output.json  Path where the JSON output will be saved');
    process.exit(1);
  }

  const inputPath = args[0]!;
  const outputPath = args[1]!;

  // Validate input file exists
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file not found: ${inputPath}`);
    process.exit(1);
  }

  // Validate input file extension
  const ext = path.extname(inputPath).toLowerCase();
  if (ext !== '.xlsx' && ext !== '.xls') {
    console.error(`Error: Input file must be .xlsx or .xls, got: ${ext}`);
    process.exit(1);
  }

  console.log(`\n📄 Reading: ${inputPath}`);

  try {
    // Parse Excel file
    const result = parseExcelToJSON(inputPath);

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (outputDir && !fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write JSON output
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');

    console.log(`\n✅ Success!`);
    console.log(`   Sheets processed: ${result.sheetsCount}`);
    console.log(`   Output saved to: ${outputPath}`);
  } catch (error) {
    console.error(`\n❌ Error processing file:`, error);
    process.exit(1);
  }
}

main();
