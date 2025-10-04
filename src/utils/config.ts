// src/utils/config.ts

export interface Config {
  baseUrl: string;
  homePath: string;
  username: string;
  password: string;
}

export const cfg: Config = {
  baseUrl: process.env.BASE_URL || 'https://anhtester.com/course/website-and-api-testing-automation-with-playwright-javascript-typescript-khong-day-code-js-ts/',
  homePath: '/home',
  username: process.env.TEST_USERNAME || 'CHIENPHAMNPP',
  password: process.env.TEST_PASSWORD || 'Sso1000!',
};

export default cfg;
