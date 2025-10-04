export class OrderData {
  id_Promotion: string | null = null;
  id_npp: string | null = null;
  diemban: string | null = null;
  khoLabelText: string | null = null;
  kenhBanHangLabelText: string | null = null;
  skuCsv: string | null = null;
  skuList: string[] = [];
  qty: string | null = null;
  namePromotion: string | null = null;

  list_expectedMaxSlots: number = Number.MAX_SAFE_INTEGER;
  list_slotsToEnter: number = -1;
  list_expectedDiscount: number = 0;

  apply_expectedMaxSlots: number = Number.MAX_SAFE_INTEGER;
  apply_slots: number = -1;
  apply_expectedDiscount: number = 0;

  submit_expectedDiscount: number = 0;

  list_maxSlotsActual: number | null = null;
  list_slotsActual: number | null = null;
  list_discountActual: number | null = null;

  apply_maxSlotsActual: number | null = null;
  apply_slotsActual: number | null = null;
  apply_discountActual: number | null = null;

  submit_discountActual: number | null = null;

  result: string | null = null;
  error: string | null = null;
  runAt: string | null = null;

  excelRowIndex: number = 0;

  getRowCodeProduct(): number {
    return Array.isArray(this.skuList) ? this.skuList.length : 0;
  }
}
