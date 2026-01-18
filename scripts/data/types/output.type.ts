export interface ExcelRow {
  [key: string]: string | null;
}

export interface SheetData {
  sheetName: string;
  headers: string[];
  rows: ExcelRow[];
}

export interface ExcelOutput {
  fileName: string;
  sheetsCount: number;
  sheets: SheetData[];
  exportedAt: string;
}
