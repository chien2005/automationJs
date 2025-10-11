// src/tests/login.test.ts
import { test, expect } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { DataReader } from '../services/DataReader.ts';
import { LoginPage } from '../pages/LoginPage.ts';
import type { ILoginData } from '../types/login-data.ts';

// 👉 Tạo __dirname cho ESM và build đường dẫn ABSOLUTE tới file JSON
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.resolve(__dirname, '../data/login-credentials.json');

const BASE_URL  = process.env.BASE_URL ?? 'https://anhttester.com/lesson/javascript-typescript-bai-...';

test('Login with JSON data', async ({ page }) => {
  const dataReader = new DataReader();
  const loginPage  = new LoginPage(page);

  const creds = await dataReader.readJsonFile<ILoginData>(DATA_FILE); // <-- truyền absolute path
  console.log(`Đọc được ${creds.length} dòng dữ liệu`);
  if (!creds?.length) {
    console.log('Không có dữ liệu test.');
    return;
  }

  for (const [i, c] of creds.entries()) {
    await test.step(`TC#${i + 1} - ${c.username}`, async () => {
      await loginPage.navigate(BASE_URL);
      await loginPage.login(c.username ?? '', c.password ?? '');
      const ok = await loginPage.verifyLoginResult(c.expected);
      expect(ok).toBeTruthy();
    });
  }
});
// echo "# PL_JS" >> README.md
// git init
// git add README.md
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/chien2005/PL_JS.git
// git push -u origin main

//git checkout -b feature/bai2

//git checkout -b feature/bai2
//git checkout -b feature/bai2