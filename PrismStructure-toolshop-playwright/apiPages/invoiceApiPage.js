const { BaseApiPage } = require('./baseApiPage');

class InvoiceApiPage extends BaseApiPage {
  async createInvoice(invoicePayload, token) {
    const options = { data: invoicePayload };

    if (token) {
      options.headers = this.authHeaders(token);
    }

    return this.post('/invoices', options);
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
