import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://demoapp-sable-gamma.vercel.app/');
  await page.getByRole('link', { name: 'Bài 1: Auto-Wait Demo' }).click();
  await page.getByRole('button', { name: 'Click Me!' }).click();
  await expect(page.locator('#status')).toContainText('Button Clicked Successfully!');
  await page.getByRole('link', { name: 'Test Page' }).click();
  await page.getByText('Tên đăng nhập:').click();
  await page.getByRole('textbox', { name: 'Tên đăng nhập:' }).fill('ávxc');
  await page.getByRole('checkbox', { name: 'Tôi đồng ý với điều khoản sử' }).check();
  await page.getByText('NamNữKhác').click();
});