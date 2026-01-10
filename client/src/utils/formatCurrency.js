/**
 * Format number into Indian currency style
 * Used across Dashboard, Sales, Expenses, Wallet
 */
const formatCurrency = (amount = 0) => {
  if (typeof amount !== "number" || isNaN(amount)) return "₹0";

  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }

  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
};

export default formatCurrency;
