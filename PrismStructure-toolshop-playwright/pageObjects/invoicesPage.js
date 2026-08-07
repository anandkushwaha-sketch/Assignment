const { BasePage } = require('./basePage');

class InvoicesPage extends BasePage {
  constructor(page) {
    super(page);
    this.pageTitle = page.getByTestId('page-title');
    this.invoiceRows = page.locator('table tbody tr, [data-test="invoice-row"], .invoice-item');
    this.invoiceTable = page.locator('table');
  }

  async open() {
    await this.goto('/account/invoices');
    await this.waitForPageLoad();
  }

  async getInvoiceCount() {
    return this.invoiceRows.count();
  }

  async openFirstInvoice() {
    const firstRow = this.invoiceRows.first();
    const link = firstRow.getByRole('link').first();
    if (await link.isVisible()) {
      await link.click();
      return;
    }
    await firstRow.click();
  }

  invoiceDetailContent() {
    return this.page.locator('main, .invoice-detail, [data-test="invoice-detail"]').first();
  }
}

module.exports = { InvoicesPage };
