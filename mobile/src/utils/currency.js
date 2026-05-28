export function formatCurrency(amount = 0) {
  return `Rs. ${Number(amount || 0).toFixed(2)}`;
}
