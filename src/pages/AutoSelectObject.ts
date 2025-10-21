import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    // 1) Login
    const login = new LoginPage(page);
    await login.goto(cfg.baseUrl);
    await login.loginNpp(cfg.username, cfg.password);

});