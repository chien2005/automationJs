// HomePage.js — tối giản, verify đang ở trang chủ qua URL
import { BasePage } from '../common/BasePage.js';

export default class HomePage extends BasePage {
  constructor(page, timeoutMs = 20_000) {
    super(page, timeoutMs);
    // thêm locator nếu cần verify UI (ví dụ avatar/menu)
    // this.avatar = page.locator("//img[contains(@class,'avatar')]");
  }

  // async at(urlSubstringOrRegex) {
  //   await this.shouldHaveUrl(urlSubstringOrRegex);
  // }
}
