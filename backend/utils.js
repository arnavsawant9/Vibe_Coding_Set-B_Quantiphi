/**
 * Normalizes subscription cost to monthly value
 * @param {number} cost - The cost value
 * @param {string} billingCycle - The billing cycle ("Monthly" or "Yearly")
 * @returns {number} - The normalized monthly cost
 */
function normalizeToMonthly(cost, billingCycle) {
  if (billingCycle === 'Yearly') {
    return cost / 12;
  }
  return cost;
}

module.exports = {
  normalizeToMonthly
};
