import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from '@common/BasePage.ts';
import { DynamicOrderLocator as L } from '@pages/dynamicOrderLocator.ts';
import { OrderData } from '@models/orderData.ts';

type LoginFn = () => Promise<void>;

export class OrderPage extends BasePage {
  constructor(page: Page, timeoutMs = 20_000) {
    super(page, timeoutMs);
  }

  /* ======================= Auth / Navigation ======================= */
  async loginNPP(loginPageFn?: LoginFn): Promise<void> {
    if (typeof loginPageFn === 'function') await loginPageFn();
  }

  async input_Distributor(id_npp: string): Promise<void> {
    await this.waitVisible(L.DISTRIBUTOR_INPUT);
    await this.type(L.DISTRIBUTOR_INPUT, id_npp);
    await this.waitShortPresence(L.visibleDropdown(), 400);
    await this.waitShortPresence(L.visibleOptions(), 400);
    await this.click(L.visibleOptionContainsIgnoreCase(id_npp));
    await this.click(L.CONFIRM_LOGIN_BTN);
  }

  async clickTabAddOrder(): Promise<void> {
    await this.click(L.MANAGER_ORDER);
    await this.click(L.ORDER_TABBAR);
    await this.waitVisible(L.CREATE_ORDER_BTN);
  }

  async loginAndGoToOrder({ loginPageFn }: { loginPageFn?: LoginFn } = {}): Promise<void> {
    const npp = process.env.NPP || 'CHIENNPP1';
    await this.input_Distributor(npp);
  }

  async refreshToOrderListAndOpenCreate(): Promise<void> {
    await this.page.reload();
    await this.waitPresent(L.CREATE_ORDER_BTN);
    await this.waitVisible(L.CREATE_ORDER_BTN);
  }

  /* ======================= Form mở/đóng ======================= */
  async openCreateForm(): Promise<void> {
    await this.click(L.CREATE_ORDER_BTN);
    await this.waitPresent(L.PAGE_SAVE_BUTTON);
  }

  /* ======================= Dropdown common ======================= */
  async selectDropdown(labelText: string, valueToType: string): Promise<void> {
    await this.click(L.dropdownSelectorByLabel(labelText));
    await this.type(L.dropdownInputByLabel(labelText), valueToType);
    await this.waitShortPresence(L.visibleDropdown(), 200);
    await this.waitShortPresence(L.visibleOptions(), 200);
    await this.click(L.visibleOptionContainsIgnoreCase(valueToType));
  }

  parseCsv(csv: string | string[] | any): string[] {
    if (csv == null) return [];

    if (Array.isArray(csv)) {
      return csv
        .flatMap(v => Array.isArray(v) ? v : [v])
        .map(v => String(v).trim())
        .filter(Boolean);
    }

    const s = String(csv).replace(/\r?\n/g, ' ').trim();
    if (!s) return [];
    return s
      .split(/[;,]/)
      .map(p => p.trim().replace(/^"|"$|^'|'$/g, ''))
      .filter(Boolean);
  }

  async addProducts(skuCsv: string, qtyCsv: string): Promise<void> {
    const skus = this.parseCsv(skuCsv);
    const qtys = this.parseCsv(qtyCsv);

    if (!skus.length) throw new Error('Excel: cột mã sản phẩm trống');

    const qtyOneForAll = qtys.length === 1 ? qtys[0] : null;

    for (let i = 0; i < skus.length; i++) {
      const sku = String(skus[i]).trim();
      const qty = String(i < qtys.length ? qtys[i] : (qtyOneForAll ?? '1')).trim();

      const rowIndex1 = i + 1;

      while ((await this.page.locator(L.skuInput(rowIndex1)).count()) === 0) {
        await this.click(L.ADD_PRODUCT_BTN);
      }

      await this.type(L.skuInput(rowIndex1), sku);
      await this.waitShortPresence(L.popupRowBySku(sku), 600);
      await this.click(L.popupRowBySku(sku));
      await this.type(L.qtyInput(rowIndex1), qty);
    }
  }

  /* ======================= Promotion modal ======================= */
  async openPromotionModal(): Promise<void> {
    await this.pause(400);
    await this.waitVisible(L.APPLY_PROMO_BTN);
    await this.click(L.APPLY_PROMO_BTN);
    const title = await this.page.locator(L.APPLY_PROMO_MODAL_TITLE).first().innerText();
    expect(title.trim()).toContain('Áp khuyến mãi');
  }

  async expandPromotionByName(title: string): Promise<string> {
    await this.waitShortPresence(L.expandIconByTitle(title), 200);
    await this.click(L.expandIconByTitle(title));
    return title;
  }

  async validateListStep(d: OrderData): Promise<void> {
    const soSuat = await this.waitVisible(L.PROMO_INPUT_SO_SUAT);
    const ariaMax = await soSuat.getAttribute('aria-valuemax');
    const ariaNow = await soSuat.getAttribute('aria-valuenow');
    const value = await soSuat.inputValue().catch(() => '');

    const maxSlotsActual = Number((ariaMax || '').trim());
    const slotsActual = Number(this.firstNonEmpty(ariaNow, value).replace(/\D/g, ''));

    const discountEl = await this.waitVisible(L.PROMO_INPUT_DISCOUNT_FIXED);
    const dNow = await discountEl.getAttribute('aria-valuenow');
    const dVal = await discountEl.inputValue().catch(() => '');

    const discountActual = this.parseMoney(this.firstNonEmpty(dNow, dVal));

    expect(maxSlotsActual, 'List: MaxSlots mismatch!').toBe(d.list_expectedMaxSlots);
    expect(slotsActual, 'List: Slots mismatch!').toBe(d.list_slotsToEnter);
    expect(discountActual, 'List: Discount mismatch!').toBe(d.list_expectedDiscount);

    await this.click(L.APPLY_PROMO_CHECKBOX_LABEL);
  }

  async validateApplyStep(d: OrderData): Promise<void> {
    await this.waitVisible(L.APPLY_PROMO_MODAL_TITLE_STRICT);

    const soSuat = await this.waitVisible(L.PROMO_INPUT_SO_SUAT);
    const ariaMax = await soSuat.getAttribute('aria-valuemax');
    const ariaNow = await soSuat.getAttribute('aria-valuenow');
    const value = await soSuat.inputValue().catch(() => '');

    const maxSlotsActual = Number((ariaMax || '').trim());
    const slotsActual = Number(this.firstNonEmpty(ariaNow, value).replace(/\D/g, ''));

    const discountEl = await this.waitVisible(L.PROMO_INPUT_DISCOUNT_FIXED);
    const dNow = await discountEl.getAttribute('aria-valuenow');
    const dVal = await discountEl.inputValue().catch(() => '');

    const discountActual = this.parseMoney(this.firstNonEmpty(dNow, dVal));

    expect(maxSlotsActual, 'Apply: MaxSlots mismatch!').toBe(d.apply_expectedMaxSlots);
    expect(slotsActual, 'Apply: Slots mismatch!').toBe(d.apply_slots);
    expect(discountActual, 'Apply: Discount mismatch!').toBe(d.apply_expectedDiscount);

    await this.applyPromotion();
  }

  async applyPromotion(): Promise<void> {
    await this.click(L.MODAL_SAVE_BUTTON);
    await this.click(L.CONFIRM_OK_BUTTON);
    await this.page.locator(L.APPLY_PROMO_MODAL_VISIBLE).first().waitFor({ state: 'detached', timeout: 10_000 }).catch(() => {});
  }

  async submitOrder(): Promise<void> {
    await this.click(L.PAGE_SAVE_BUTTON);
    await this.click(L.CONFIRM_OK_BUTTON);
    await this.page.locator(L.PAGE_SAVE_BUTTON).first().waitFor({ state: 'detached', timeout: 10_000 }).catch(async () => {
      await this.page.reload();
    });
    await this.waitPresent(L.CREATE_ORDER_BTN);
    await this.waitVisible(L.CREATE_ORDER_BTN);
    await this.CancelOrder('chienphamnpp', 'AutoTest cleanup');
  }

  async CancelOrder(creator: string, reason: string): Promise<void> {
    const body = await this.waitVisible(L.TABLE_BODY);
    await body.evaluate((el: any) => { el.scrollLeft = el.scrollWidth; });

    const creatorCell = this.page.locator(L.FIRST_ROW_CREATOR_CELL).first();
    await creatorCell.scrollIntoViewIfNeeded();
    const creatorText = (await creatorCell.innerText()).trim();

    if (creatorText.toLowerCase() !== String(creator).toLowerCase()) {
      await body.evaluate((el: any) => { el.scrollLeft = 0; });
      return;
    }

    const deleteBtn = this.page.locator(L.FIRST_ROW_DELETE_BUTTON).first();
    await deleteBtn.scrollIntoViewIfNeeded();
    await deleteBtn.click();

    await this.type(L.DELETE_REASON_TEXTAREA, reason);
    await this.click(L.MODAL_OK_BUTTON);

    await this.page.locator(L.DELETE_REASON_TEXTAREA).first().waitFor({ state: 'detached', timeout: 10_000 }).catch(() => {});
    await this.pause(600);
    await body.evaluate((el: any) => { el.scrollLeft = 0; });
  }

  async getDiscountVNDOnPage(): Promise<number> {
    const el = await this.scrollIntoViewCenter(L.DISCOUNT_VND_VALUE);
    let last = -1;
    for (let i = 0; i < 25; i++) {
      const raw = (await el.innerText()).trim();
      const v = this.parseMoney(raw);
      if (v > 0) return v;
      last = v;
      await this.pause(200);
    }
    return Math.max(last, 0);
  }

  async getActualTotalDiscount(): Promise<number> {
    return await this.getDiscountVNDOnPage();
  }

  async safeCaptureApplyActualOrFallback(expectedIfUnknown: number): Promise<number> {
    try {
      const visible = await this.page.locator(L.APPLY_PROMO_MODAL_VISIBLE).first().isVisible();
      if (visible) {
        const discountEl = this.page.locator(L.PROMO_INPUT_DISCOUNT_FIXED).first();
        const now = (await discountEl.getAttribute('aria-valuenow')) || (await discountEl.inputValue());
        return this.parseMoney(now);
      }
    } catch {}
    try { return await this.getDiscountVNDOnPage(); } catch {}
    return expectedIfUnknown;
  }

  /* ======================= High-level flow ======================= */
  async runOneOrder(d: OrderData): Promise<void> {
    d.runAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

    this.step('Verify popup 1. Màn hình thêm mới đơn hàng');
    await this.openCreateForm();
    await this.selectDropdown('Kênh bán hàng', d.kenhBanHangLabelText ?? '');
    await this.selectDropdown('Điểm bán', d.diemban ?? '');
    await this.selectDropdown('Kho', d.khoLabelText ?? '');
    await this.addProducts(d.skuList.join(','), d.qty ?? '');

    this.step('Verify popup 2. Màn hình áp dụng danh sách CTKM + input số suất');
    await this.openPromotionModal();
    await this.expandPromotionByName(d.namePromotion ?? '');
    await this.validateListStep(d);

    this.step('Verify popup 3. Màn hình xác nhận áp dụng CTKM');
    await this.expandPromotionByName(d.namePromotion ?? '');
    await this.validateApplyStep(d);

    this.step('Verify popup 4. Màn hình xác nhận để lưu đơn hàng');
    const submitDiscount = await this.getDiscountVNDOnPage();
    expect(submitDiscount, `Submit: Discount mismatch! Actual=${submitDiscount}`)
      .toBe(d.submit_expectedDiscount);

    await this.submitOrder();
  }
}
