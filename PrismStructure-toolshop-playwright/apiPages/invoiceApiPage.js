const { BaseApiPage } = require('./baseApiPage');

class InvoiceApiPage extends BaseApiPage {
  async createInvoice(invoicePayload, token) {
    return this.post('/invoices', {
      headers: this.authHeaders(token),
      data: invoicePayload,
    });
  }

  async getInvoices(token) {
    return this.get('/invoices', {
      headers: this.authHeaders(token),
    });
  }

  async getInvoiceById(invoiceId, token) {
    return this.get(`/invoices/${invoiceId}`, {
      headers: this.authHeaders(token),
    });
  }
}

module.exports = { InvoiceApiPage };
