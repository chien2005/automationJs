// src/utils/excel.ts
import * as fs from 'fs';
import * as XLSX from 'xlsx';
import { OrderData } from '@models/orderData.ts';

type Row = (string | number | null)[];
type HeaderMap = Map<string, number>;

const norm = (s: unknown): string => (s ?? '').toString().trim();
const lower = (s: unknown): string => norm(s).toLowerCase();

function headerMap(headerRow: Row): HeaderMap {
  const m = new Map<string, number>();
  (headerRow || []).forEach((name, i) => {
    if (name != null && name !== '') m.set(norm(name), i);
  });
  return m;
}

function headerMapNormalized(headerRow: Row): HeaderMap {
  const m = new Map<string, number>();
  (headerRow || []).forEach((name, i) => {
    if (name != null && name !== '') m.set(lower(name), i);
  });
  return m;
}

function firstPresent(map: HeaderMap, ...names: string[]): number | null {
  for (const n of names) {
    const idx = map.get(n);
    if (idx !== undefined) return idx;
  }
  return null;
}

function firstPresentNormalized(map: HeaderMap, ...names: string[]): number | null {
  for (const n of names) {
    const idx = map.get(lower(n));
    if (idx !== undefined) return idx;
  }
  return null;
}

function parseCsv(csv: string): string[] {
  if (!csv || !String(csv).trim()) return [];
  return String(csv).split(',').map(s => s.trim()).filter(Boolean);
}

function toInt(raw: unknown, def: number): number {
  try {
    const s = norm(raw);
    if (!s) return def;
    const n = parseInt(s.replace(/\D/g, ''), 10);
    return Number.isNaN(n) ? def : n;
  } catch { return def; }
}

function toLong(raw: unknown, def: number): number {
  try {
    const s = norm(raw);
    if (!s) return def;
    const n = parseInt(s.replace(/\D/g, ''), 10);
    return Number.isNaN(n) ? def : n;
  } catch { return def; }
}

/** Đọc sheet Orders → list OrderData */
export function readSheet(
  excelPath: string = process.env.ORDERS_XLSX || 'src/data/Orders.xlsx',
  sheetName: string = process.env.ORDERS_SHEET || 'SellOut_GiamTien'
): OrderData[] {
  if (!fs.existsSync(excelPath)) {
    throw new Error(`Excel not found: ${excelPath}`);
  }

  const wb = XLSX.readFile(excelPath, { cellDates: false });
  const ws = sheetName ? wb.Sheets[sheetName] : wb.Sheets[wb.SheetNames[0]];
  if (!ws) throw new Error(`Sheet not found: ${sheetName}`);

  // ✅ Generic đúng: mỗi phần tử là 1 Row
  const aoa = XLSX.utils.sheet_to_json<Row>(ws, { header: 1, raw: false, defval: '' });
  // ✅ Ép kiểu header rõ ràng
  const header: Row = (aoa[0] ?? []) as Row;

  const map = headerMap(header);
  const mapNorm = headerMapNormalized(header);

  let colCtkm = firstPresent(map, 'id_Promotion', 'CTKM_ID', 'id_ctkm', 'MaCTKM', 'CTKM');
  if (colCtkm == null) {
    colCtkm = firstPresentNormalized(mapNorm, 'id_Promotion', 'ctkm_id', 'id_ctkm', 'mactkm', 'ctkm');
  }

  const items: OrderData[] = [];

  for (let r = 1; r < aoa.length; r++) {
    const row = aoa[r] || [];
    const d = new OrderData();
    d.excelRowIndex = r;

    const get = (idx: number | null | undefined): string => (idx == null ? '' : norm(row[idx]));
    const getInt = (idx: number | null | undefined, def: number): number => toInt(get(idx), def);
    const getLong = (idx: number | null | undefined, def: number): number => toLong(get(idx), def);
    const c = (name: string): number | undefined => map.get(name);

    d.id_Promotion = colCtkm != null ? get(colCtkm) : null;

    d.diemban              = get(c('DiemBan'));
    d.id_npp               = get(c('id_npp'));
    d.khoLabelText         = get(c('Kho'));
    d.kenhBanHangLabelText = get(c('KenhBanHang'));
    d.skuCsv               = get(c('codeSanPham'));
    d.skuList              = parseCsv(d.skuCsv);
    d.qty                  = get(c('qty'));
    d.namePromotion        = get(c('NamePromotion'));

    d.list_expectedMaxSlots   = getInt(c('List_SoSuatToiDa'), Number.MAX_SAFE_INTEGER);
    d.list_slotsToEnter       = getInt(c('List_SoSuat'), -1);
    d.list_expectedDiscount   = getLong(c('List_GiamGiaMongDoi'), 0);
    d.apply_expectedMaxSlots  = getInt(c('Apply_SoSuatToiDa'), Number.MAX_SAFE_INTEGER);
    d.apply_slots             = getInt(c('Apply_SoSuat'), -1);
    d.apply_expectedDiscount  = getLong(c('Apply_GiamGiaMongDoi'), 0);
    d.submit_expectedDiscount = getLong(c('Submit_GiamGiaMongDoi'), 0);

    // bỏ dòng rỗng
    if (!d.id_npp && (!d.skuList || d.skuList.length === 0)) continue;

    items.push(d);
  }

  return items;
}

/** Ghi kết quả về lại file Excel */
export function writeBack(
  excelPath: string,
  sheetName: string,
  dataList: OrderData[],
): void {
  if (!fs.existsSync(excelPath)) {
    throw new Error(`Excel not found: ${excelPath}`);
  }

  const wb = XLSX.readFile(excelPath, { cellDates: false });
  const wsName = sheetName || wb.SheetNames[0];
  const ws = wb.Sheets[wsName];
  if (!ws) throw new Error(`Sheet not found: ${wsName}`);

  // ✅ Generic đúng & ép header rõ ràng
  const aoa: Row[] = XLSX.utils.sheet_to_json<Row>(ws, { header: 1, raw: false, defval: '' });
  if (!aoa.length) aoa.push([] as Row);
  const header: Row = (aoa[0] ?? []) as Row;

  const ensureHeaderCell = (name: string): number => {
    // dùng any[] để dùng indexOf/push dễ dàng
    const hdr = header as any[];
    let idx = hdr.indexOf(name);
    if (idx === -1) {
      hdr.push(name);
      idx = hdr.length - 1;
    }
    return idx;
  };

  const map = headerMap(header);
  const mapNorm = headerMapNormalized(header);

  const colResult       = firstPresent(map, 'Result', 'Kết quả', 'KetQua');
  const colApplyActual  = firstPresent(map, 'Apply_GiamGiaThucTe', 'Apply_ActualDiscount');
  const colSubmitActual = firstPresent(map, 'Submit_GiamGiaThucTe', 'Submit_ActualDiscount');

  let colError = firstPresent(map, 'Error', 'Erorr', 'Errors', 'Lỗi', 'Loi');
  if (colError == null) colError = firstPresentNormalized(mapNorm, 'error', 'erorr', 'errors', 'lỗi', 'loi');
  if (colError == null) colError = ensureHeaderCell('Error');

  const colTime = firstPresent(map, 'Time', 'ThoiGian', 'Thời gian');

  const set = (row: Row, idx: number, val: unknown): void => {
    while (row.length <= idx) row.push('');
    row[idx] = (val == null ? '' : (val as any));
  };

  for (const d of dataList) {
    const r = d.excelRowIndex;
    if (!aoa[r]) aoa[r] = [] as Row;
    const row = aoa[r];

    if (map.get('List_SoSuatToiDaThucTe') != null) set(row, map.get('List_SoSuatToiDaThucTe')!, d.list_maxSlotsActual);
    if (map.get('List_SoSuatThucTe')     != null) set(row, map.get('List_SoSuatThucTe')!,     d.list_slotsActual);
    if (map.get('List_GiamGiaThucTe')    != null) set(row, map.get('List_GiamGiaThucTe')!,    d.list_discountActual);

    if (map.get('Apply_SoSuatToiDaThucTe') != null) set(row, map.get('Apply_SoSuatToiDaThucTe')!, d.apply_maxSlotsActual);
    if (map.get('Apply_SoSuatThucTe')      != null) set(row, map.get('Apply_SoSuatThucTe')!,      d.apply_slotsActual);
    if (colApplyActual != null) set(row, colApplyActual, d.apply_discountActual);

    if (colSubmitActual != null) set(row, colSubmitActual, d.submit_discountActual);

    if (colResult != null) set(row, colResult, d.result);
    set(row, colError, d.error);

    if (colTime != null) {
      const ts = d.runAt ? d.runAt : new Date().toISOString().slice(0, 19).replace('T', ' ');
      set(row, colTime, ts);
    }
  }

  const newWs = XLSX.utils.aoa_to_sheet(aoa);
  wb.Sheets[wsName] = newWs;
  XLSX.writeFile(wb, excelPath);
}
