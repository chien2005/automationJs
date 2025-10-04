// src/test/Page/LoginPage.js
import { expect } from '@playwright/test';

export default class LoginPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page, timeoutMs = 20_000) {
    this.page = page;
    this.timeoutMs = timeoutMs;

    // Locators (UPPER_SNAKE -> camelCase)
    this.username = page.locator("//input[@id='username']");
    this.password = page.locator("//input[@id='password']");
    this.btnLogin = page.locator("//button[contains(@class,'btn-login')]");
  }

  // --- Actions (giữ tên method cũ, chuẩn camelCase) ---
  async enterUsername(user) {
    await this.username.waitFor({ state: 'visible', timeout: this.timeoutMs });
    await this.username.fill('');                // clear
    await this.username.type(user);              // type để giống sendKeys
  }

  async enterPassword(pass) {
    await this.password.waitFor({ state: 'visible', timeout: this.timeoutMs });
    await this.password.fill('');
    await this.password.type(pass); 
  }

  async clickLogin() {
    await this.btnLogin.waitFor({ state: 'visible', timeout: this.timeoutMs });
    await expect(this.btnLogin).toBeEnabled({ timeout: this.timeoutMs });
    await this.btnLogin.click();
  }

  // ConfigReader.get('key') -> dùng env cho gọn (PLAYWRIGHT)
  async login() {
    await this.enterUsername(process.env.username ?? '');
    await this.enterPassword(process.env.password ?? '');
    await this.clickLogin();
  }

  async loginNpp() { // loginnpp -> loginNpp
    await this.enterUsername(process.env.usernamenpp ?? '');
    await this.enterPassword(process.env.passwordnpp ?? '');
    await this.clickLogin();
  }
}
