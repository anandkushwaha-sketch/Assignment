const { BasePage } = require('./basePage');

class InvoicesPage extends BasePage {
  constructor(page) {
    super(page);
    this.pageTitle = page.getByTestId('page-title');
    this.invoiceRows = page.locator('table tbody tr').filter({
      has: page.getByRole('link'),
    });
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

  invoiceProductsTable() {
    return this.page.getByRole('heading', { name: /^products$/i }).locator('..').getByRole('table');
  }

  invoiceDetailContent() {
    return this.page.locator('h3').filter({ hasText: /general information/i }).first().locator('../..');
  }
}

module.exports = { InvoicesPage };
