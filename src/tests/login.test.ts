import { test, expect, Page } from '@playwright/test';
import cfg from '@utils/config.ts';
import { LoginPage } from '../pages/LoginPage.ts';
test.describe('Login - Homepage (POM)', () => {
  test('login thành công điều hướng vào trang chủ', async ({ page }: { page: Page }) => {
    const login = new LoginPage(page);
    await login.goto(cfg.baseUrl);
    await login.loginNpp(cfg.username, cfg.password);

    // ví dụ check:
    // await expect(page).toHaveURL(/home/i);
  });
});
