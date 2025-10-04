import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  protected page: Page;
  protected timeoutMs: number;

  constructor(page: Page, timeoutMs = 20_000) {
    this.page = page;
    this.timeoutMs = timeoutMs;
  }

  protected toLocator = (sel: string | Locator): Locator =>
    typeof sel === 'string' ? this.page.locator(sel) : sel;

  async goto(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async pause(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  async click(sel: string | Locator, opts: Record<string, any> = {}): Promise<void> {
    const el = this.toLocator(sel).first();
    await el.click({ ...opts });
  }

  async type(sel: string | Locator, text: string, opts: Record<string, any> = {}): Promise<void> {
    const el = this.toLocator(sel).first();
    await el.fill('');
    await el.type(text, { delay: 20, ...opts });
  }

  async waitPresent(sel: string | Locator, timeout: number = this.timeoutMs): Promise<Locator> {
    const el = this.toLocator(sel).first();
    await el.waitFor({ state: 'attached', timeout });
    return el;
  }

  async waitVisible(sel: string | Locator, timeout: number = this.timeoutMs): Promise<Locator> {
    const el = this.toLocator(sel).first();
    await el.waitFor({ state: 'visible', timeout });
    return el;
  }

  async waitShortPresence(sel: string | Locator, timeout: number = 400): Promise<void> {
    try {
      await this.toLocator(sel).first().waitFor({ state: 'visible', timeout });
    } catch { /* swallow short waits */ }
  }

  async scrollIntoViewCenter(sel: string | Locator): Promise<Locator> {
    const el = this.toLocator(sel).first();
    await el.scrollIntoViewIfNeeded();
    return el;
  }

  firstNonEmpty(...arr: any[]): string {
    return arr.find(v => v != null && String(v).trim() !== '') ?? '';
  }

  parseMoney(s: string | number | null | undefined): number {
    const t = String(s ?? '').replace(/[^\d-]/g, '');
    return t ? Number(t) : 0;
  }

  step(title: string): void {
    console.log(`\n--- ${title} ---`);
  }
}
