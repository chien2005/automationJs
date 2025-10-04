export const DynamicOrderLocator = {
  // Login NPP
  DISTRIBUTOR_INPUT: "//input[@id='distributor_id']",
  CONFIRM_LOGIN_BTN: "//button[span[normalize-space(text())='Đồng ý']]",

  // Tab/Buttons
  MANAGER_ORDER: "//div[@role='menuitem']//span[normalize-space(text())='Quản Lý Bán Hàng']",
  ORDER_TABBAR: "//a[@href='/sale/orders-distributor']//span[normalize-space(text())='Đơn Bán Hàng']",
  CREATE_ORDER_BTN: "//button[normalize-space(text())='Tạo mới']",

  // Dropdown theo LABEL
  dropdownSelectorByLabel: (labelText: string): string =>
    `//label[normalize-space(.)='${labelText}']` +
    `/ancestor::div[contains(@class,'ant-form-item')]//div[contains(@class,'ant-select-selector')]`,

  dropdownInputByLabel: (labelText: string): string =>
    `//label[normalize-space(.)='${labelText}']` +
    `/ancestor::div[contains(@class,'ant-form-item')]//input[@type='search' and contains(@class,'ant-select-selection-search-input')]`,

  // Dropdown đang mở + options
  visibleDropdown: (): string =>
    `//div[contains(@class,'ant-select-dropdown') and not(contains(@class,'ant-select-dropdown-hidden'))]`,

  visibleOptions: (): string =>
    `//div[contains(@class,'ant-select-dropdown') and not(contains(@class,'ant-select-dropdown-hidden'))]` +
    `//div[contains(@class,'ant-select-item-option')]`,

  visibleFirstOption: (): string =>
    `(` +
    `//div[contains(@class,'ant-select-dropdown') and not(contains(@class,'ant-select-dropdown-hidden'))]` +
    `//div[contains(@class,'ant-select-item-option')])[1]`,

  visibleActiveOption: (): string =>
    `//div[contains(@class,'ant-select-dropdown') and not(contains(@class,'ant-select-dropdown-hidden'))]` +
    `//div[contains(@class,'ant-select-item-option') and contains(@class,'-active')]`,

  // Option theo text
  visibleOptionExact: (text: string): string =>
    `//div[contains(@class,'ant-select-dropdown') and not(contains(@class,'ant-select-dropdown-hidden'))]` +
    `//div[contains(@class,'ant-select-item-option-content') and normalize-space(.)='${text}']`,

  visibleOptionContainsIgnoreCase: (partial: string): string =>
    `//div[contains(@class,'ant-select-dropdown') and not(contains(@class,'ant-select-dropdown-hidden'))]` +
    `//div[contains(@class,'ant-select-item-option') and contains(` +
    `translate(translate(normalize-space(.), '[] ', ''), 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'),` +
    `translate(translate('${partial}', '[] ', ''), 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'))]`,

  // Button thêm 1 dòng sản phẩm
  ADD_PRODUCT_BTN: "//button[span[normalize-space(.)='Thêm sản phẩm']]",

  // Input SKU theo index dòng (rowIndex bắt đầu từ 1)
  skuInput: (rowIndex: number): string =>
    `//input[@id=concat('rows_', ${rowIndex - 1}, '_searchPr')]`,

  // Hàng sản phẩm trong popup theo SKU
  popupRowBySku: (sku: string): string =>
    `//div[contains(@class,'ant-table-body')]//tbody//tr[td[1][normalize-space(.)='${sku}']]`,

  // Input số lượng theo index dòng
  qtyInput: (rowIndex: number): string =>
    `//input[@id=concat('rows_', ${rowIndex - 1}, '_quantity')]`,

  // Dropdown đã chọn
  selectedValueByLabel: (labelText: string): string =>
    `//label[normalize-space(.)='${labelText}']` +
    `/ancestor::div[contains(@class,'ant-form-item')]` +
    `//span[contains(@class,'ant-select-selection-item')]`,

  // Cell SKU theo row index
  rowSkuCellByRowIndex: (rowIndex: number): string =>
    `//input[@id=concat('rows_', ${rowIndex}, '_quantity')]/ancestor::tr//td[1]`,

  // Modal title
  CREATE_ORDER_MODAL_TITLE:
    "//div[contains(@class,'ant-modal-title') and normalize-space(.)='Tạo mới đơn hàng bán']",

  // All quantity inputs
  ALL_QTY_INPUTS: "//input[starts-with(@id,'rows_') and contains(@id,'_quantity')]",

  // Button Áp khuyến mãi
  APPLY_PROMO_BTN: "//button[span[normalize-space(.)='Áp khuyến mãi']]",

  // Modal title
  APPLY_PROMO_MODAL_TITLE:
    "//div[contains(@class,'ant-modal-title') and normalize-space(.)='Áp khuyến mãi']",

  APPLY_PROMO_MODAL_TITLE_STRICT:
    "//div[contains(@class,'ant-modal') and not(contains(@class,'ant-modal-hidden'))]" +
    "//div[contains(@class,'ant-modal-title') and normalize-space(.)='Áp khuyến mãi']",

  expandIconByTitle: (title: string): string =>
    `//div[contains(@class,'ant-collapse-header')][.//span[contains(normalize-space(),'${title}')]]` +
    `//div[contains(@class,'ant-collapse-expand-icon')]`,

  // Promotion modal controls
  PROMO_INPUT_SO_SUAT:
    "//div[contains(@class,'ant-input-number-input-wrap')]//input" +
    "[contains(@id,'_count') and @role='spinbutton' and @placeholder='Nhập số suất']",

  PROMO_INPUT_DISCOUNT_FIXED:
    "//div[contains(@class,'ant-input-number-input-wrap')]//input" +
    "[contains(@id,'_discountFixedAmount_values_discount') and @disabled]",

  APPLY_PROMO_CHECKBOX_LABEL:
    "//div[contains(@class,'ant-modal-footer')]//label[.//span[normalize-space()='Áp dụng khuyến mãi trên đơn hàng']]",

  MODAL_SAVE_BUTTON:
    "(//div[contains(@class,'ant-modal') and not(contains(@style,'display: none'))]" +
    "//div[contains(@class,'ant-modal-footer')]//button[normalize-space()='Lưu'])[last()]",

  CONFIRM_OK_BUTTON:
    "(//div[contains(@class,'ant-popover') and not(contains(@style,'display: none'))]" +
    "//button[.//span[normalize-space()='Đồng ý'] or normalize-space()='Đồng ý'])[last()]",

  // Tổng khuyến mãi VND
  DISCOUNT_VND_VALUE: "//div[contains(@class,'sumary')]/div[2]/div[3]",
  DISCOUNT_VND_TEXT: "//div[contains(@class,'sumary')]/div[2]/div[3]",

  // Nút Lưu đơn
  PAGE_SAVE_BUTTON:
    "(//div[contains(@class,'ant-modal') and not(contains(@style,'display: none'))]" +
    "//div[contains(@class,'ant-modal-footer')]//button[normalize-space()='Lưu'])[last()]",

  // Modal áp khuyến mãi đang mở
  APPLY_PROMO_MODAL_VISIBLE:
    "//div[contains(@class,'ant-modal')][.//div[contains(@class,'ant-modal-title') and normalize-space()='Áp khuyến mãi']]" +
    "[not(contains(@class,'ant-modal-hidden'))]",

  // List đơn hàng (xóa đơn)
  TABLE_BODY: ".ant-table-body", // CSS Selector
  FIRST_ROW_CREATOR_CELL: "//tr[@data-row-key=0]/td[8]",
  FIRST_ROW_DELETE_BUTTON: "//tr[@data-row-key='0']//td[last()]//button[.//span[@aria-label='delete']]",

  DELETE_REASON_TEXTAREA: "//textarea[@placeholder='Nhập lý do']",
  MODAL_OK_BUTTON: "//button[span[normalize-space()='Đồng ý']]",
};
