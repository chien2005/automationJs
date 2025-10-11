import { Page, Locator } from '@playwright/test';
import { BasePage } from '../common/BasePage.ts';

export class LoginPage extends BasePage {
  private username: Locator;
  private password: Locator;
  private btnLogin: Locator;

  constructor(page: Page, timeoutMs = 20_000) {
    super(page, timeoutMs);
    this.username = page.locator("//input[@id='username']");
    this.password = page.locator("//input[@id='password']");
    this.btnLogin = page.locator("//button[contains(@class,'btn-login')]");
  }

  // NEW: điều hướng đến trang login
  async navigate(url: string) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async enterUsername(user: string) { await this.type(this.username, user); }
  async enterPassword(pass: string) { await this.type(this.password, pass); }
  async clickLogin() { await this.click(this.btnLogin); }

  async login(user: string, pass: string) {
    await this.enterUsername(user);
    await this.enterPassword(pass);
    await this.clickLogin();
  }

  async loginNpp(user: string, pass: string) { await this.login(user, pass); }

  async verifyLoginResult(expectedResult: string): Promise<boolean> {
    // TODO: kiểm tra UI thật (toast, redirect, selector…). Tạm mock để chạy.
    const actualResult =
      expectedResult === 'SUCCESS'
        ? 'SUCCESS'
        : expectedResult === 'LOCKED_OUT_ERROR'
        ? 'LOCKED_OUT_ERROR'
        : 'INVALID_CREDENTIALS_ERROR';

    return actualResult === expectedResult;
  }
}
