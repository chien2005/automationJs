import fs from 'node:fs/promises';
import path from 'node:path';
import * as XLSX from 'xlsx';

export class DataReader {
  async readJsonFile<T>(filePath: string): Promise<T[]> {
    console.log(`DataReader: Đang đọc JSON: ${filePath}`);
    try {
      const absolutePath = path.isAbsolute(filePath)
        ? filePath
        : path.resolve(process.cwd(), filePath); // <-- tính từ project root
      const fileContent = await fs.readFile(absolutePath, 'utf-8');
      const data = JSON.parse(fileContent) as T[];
      console.log(`DataReader: OK, ${data.length} dòng`);
      return data;
    } catch (err) {
      console.error(`DataReader: Lỗi đọc JSON: ${filePath}`, err);
      return [];
    }
  }

  async readXlsxFile<T>(filePath: string, sheetName: string): Promise<T[]> {
    console.log(`DataReader: Đang đọc XLSX: ${filePath}`);
    try {
      const absolutePath = path.isAbsolute(filePath)
        ? filePath
        : path.resolve(process.cwd(), filePath);
      const buf = await fs.readFile(absolutePath);
      const wb = XLSX.read(buf, { type: 'buffer' });
      const ws = wb.Sheets[sheetName];
      if (!ws) throw new Error(`Không thấy sheet: ${sheetName}`);
      const data = XLSX.utils.sheet_to_json<T>(ws);
      console.log(`DataReader: OK, ${data.length} dòng`);
      return data;
    } catch (err) {
      console.error(`DataReader: Lỗi đọc XLSX: ${filePath}`, err);
      return [];
    }
  }
}
