import { test, Page } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

import cfg from '@utils/config';
import { OrderPage } from '@pages/OrderPage';
import LoginPage from '@pages/LoginPage';
import { OrderRunner } from '@runner/OrderRunner';

test.describe('SellOut - Áp CTKM - Giảm tiền', () => {
  test('runGiamTien', async ({ page }: { page: Page }) => {
    // 1) Login
    const login = new LoginPage(page);
    await login.goto(cfg.baseUrl);
    await login.loginNpp(cfg.username, cfg.password);

    // 2) Khởi tạo page object
    const orderPage = new OrderPage(page);

    // 3) Điều hướng tới tab "Đơn bán hàng"
    await orderPage.loginAndGoToOrder();
    await orderPage.clickTabAddOrder();

    // 4) Chạy runner
    const runner = new OrderRunner(orderPage);
    await runner.runGiamTien();
  });
});
