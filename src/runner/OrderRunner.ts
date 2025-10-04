import { readSheet, writeBack } from '@utils/excel';
import { OrderPage } from '@pages/OrderPage';
import { OrderData } from '@models/orderData';

const ANSI = {
  RESET: '\x1b[0m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  CYAN: '\x1b[36m',
};

interface RunnerOptions {
  excelPath?: string;
  sheetName?: string;
}

export class OrderRunner {
  private orderPage: OrderPage;
  private excelPath: string;
  private sheetName: string;

  constructor(orderPage: OrderPage, opts: RunnerOptions = {}) {
    this.orderPage = orderPage;
    this.excelPath = opts.excelPath || process.env.ORDERS_XLSX || 'src/data/Orders.xlsx';
    this.sheetName = opts.sheetName || process.env.ORDERS_SHEET || 'SellOut_GiamTien';
  }

  private shortErr(err: any): string {
    const type = err?.name || 'Error';
    let msg = (err?.message || '').trim();
    if (msg.length > 300) msg = msg.slice(0, 300) + '...';
    return `${type}: ${msg}`;
  }

  private safeIdx(d: OrderData): string {
    try { return String(d.excelRowIndex); } catch { return '?'; }
  }

  async runGiamTien(): Promise<void> {
    const allStart = Date.now();
    const orders: OrderData[] = readSheet(this.excelPath, this.sheetName);

    console.log(`${ANSI.CYAN}========== BẮT ĐẦU CHẠY ${orders.length} DÒNG ==========${ANSI.RESET}`);

    for (const d of orders) {
      const start = Date.now();
      let caseFailed = false;

      console.log('\n------------------------------------------------------------');
      console.log(`[CASE] Row=${this.safeIdx(d)}`);
      console.log(`[INPUT] NPP=${d.id_npp} | Điểm bán=${d.diemban} | Kho=${d.khoLabelText} | Kênh=${d.kenhBanHangLabelText}`);
      console.log(`[INPUT] SKU=${d.skuList} | Qty=${d.qty} | Expected_Discount=${d.apply_expectedDiscount}`);

      try {
        await this.orderPage.runOneOrder(d);
        d.result = 'PASSED';
        d.error = '';
        console.log(`${ANSI.GREEN}[PASS] Row=${this.safeIdx(d)} | ${Date.now() - start} ms${ANSI.RESET}`);
      } catch (e: any) {
        caseFailed = true;
        // ensure awaited value
        d.apply_discountActual = await this.orderPage.safeCaptureApplyActualOrFallback(d.apply_expectedDiscount);
        d.result = 'FAILED';
        d.error = this.shortErr(e);
        console.log(`${ANSI.RED}[FAIL] Row=${this.safeIdx(d)} | ${d.error} | ${Date.now() - start} ms${ANSI.RESET}`);
      } finally {
        try {
          writeBack(this.excelPath, this.sheetName, [d]);
          console.log(`[WRITEBACK] Row=${this.safeIdx(d)}`);
        } catch (io: any) {
          console.log(`[WRITEBACK][ERROR] Row=${this.safeIdx(d)} | ${this.shortErr(io)}`);
        }
        if (caseFailed) {
          await this.orderPage.refreshToOrderListAndOpenCreate();
          console.log('[RESET] F5 done (case FAIL)');
        }
      }
    }

    console.log(`${ANSI.CYAN}\n========== KẾT THÚC | Tổng thời gian = ${Date.now() - allStart} ms ==========\n${ANSI.RESET}`);
  }
}
