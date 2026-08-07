const { BasePage } = require('./basePage');

class InvoicesPage extends BasePage {
  constructor(page) {
    super(page);
    this.invoiceRows = page.locator('[data-test="invoice-row"], table tbody tr, .invoice-item');
    this.invoiceList = page.locator('[data-test="invoice-list"], .invoice-list');
  }

  async open() {
    await this.goto('/account/invoices');
    await this.waitForPageLoad();
  }

  async getInvoiceCount() {
    return this.invoiceRows.count();
  }

  firstInvoiceLink() {
    return this.invoiceRows.first().getByRole('link').or(this.invoiceRows.first());
  }
}

module.exports = { InvoicesPage };
