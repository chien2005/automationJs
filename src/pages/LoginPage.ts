import { Page, Locator } from '@playwright/test';
import { BasePage } from '@common/BasePage';

export default class LoginPage extends BasePage {
  private username: Locator;
  private password: Locator;
  private btnLogin: Locator;

  constructor(page: Page, timeoutMs = 20_000) {
    super(page, timeoutMs);
    this.username = page.locator("//input[@id='username']");
    this.password = page.locator("//input[@id='password']");
    this.btnLogin = page.locator("//button[contains(@class,'btn-login')]");
  }

  async enterUsername(user: string): Promise<void> {
    await this.type(this.username, user);
  }

  async enterPassword(pass: string): Promise<void> {
    await this.type(this.password, pass);
  }

  async clickLogin(): Promise<void> {
    await this.click(this.btnLogin);
  }

  async login(user: string, pass: string): Promise<void> {
    await this.enterUsername(user);
    await this.enterPassword(pass);
    await this.clickLogin();
  }

  async loginNpp(user: string, pass: string): Promise<void> {
    await this.login(user, pass);
  }
}
