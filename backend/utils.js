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

/**
 * Calculates the number of days until renewal
 * @param {string|Date} nextRenewalDate - The next renewal date
 * @param {Date} currentDate - The current date (defaults to today)
 * @returns {number} - The integer number of days between the dates
 */
function daysUntilRenewal(nextRenewalDate, currentDate = new Date()) {
  const renewal = new Date(nextRenewalDate);
  const current = new Date(currentDate);
  
  // Normalize both dates to midnight for accurate day calculation
  renewal.setHours(0, 0, 0, 0);
  current.setHours(0, 0, 0, 0);
  
  const timeDiff = renewal - current;
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
  return daysDiff;
}

/**
 * Checks if a subscription is renewing soon
 * @param {number} days - The number of days until renewal
 * @returns {boolean} - True if days is between 0 and 7 inclusive
 */
function isRenewingSoon(days) {
  return days >= 0 && days <= 7;
}

module.exports = {
  normalizeToMonthly,
  daysUntilRenewal,
  isRenewingSoon
};
