/**
 * Assessment quirk: invoice generation requires Confirm to be clicked twice.
 */
async function confirmInvoiceTwice(page, confirmButton) {
  const button = confirmButton || page.getByRole('button', { name: /confirm/i });
  await button.waitFor({ state: 'visible' });
  await button.click();
  await button.click();
}

module.exports = {
  confirmInvoiceTwice,
};
