/**
 * Assessment quirk: invoice generation requires Confirm to be clicked twice.
 * Waits for button visibility between clicks — no fixed sleeps.
 */
async function confirmInvoiceTwice(page, confirmButton) {
  const button = confirmButton || page.getByRole('button', { name: /confirm/i });

  await button.waitFor({ state: 'visible' });
  await button.click();
  await page.getByText('Payment was successful').waitFor({ state: 'visible' });
  await button.waitFor({ state: 'visible' });
  await button.click();
}

module.exports = {
  confirmInvoiceTwice,
};
