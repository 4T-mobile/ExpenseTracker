/**
 * Currency formatting utilities for VND (Vietnamese Dong).
 */

/**
 * Format number as VND currency.
 * VND doesn't use decimals, so we round to the nearest integer.
 */
export const formatCurrency = (amount: number): string => {
  try {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (error) {
    return `${Math.round(amount).toLocaleString('vi-VN')} ₫`;
  }
};

/**
 * Format number as compact VND currency (e.g., "1.5K ₫", "1.2M ₫").
 */
export const formatCurrencyCompact = (amount: number): string => {
  const absAmount = Math.abs(amount);

  if (absAmount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)}B ₫`;
  }
  if (absAmount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M ₫`;
  }
  if (absAmount >= 1_000) {
    return `${(amount / 1_000).toFixed(1)}K ₫`;
  }
  return `${Math.round(amount)} ₫`;
};

/**
 * Parse currency string to number.
 * Removes all non-numeric characters (including thousand separators).
 * VND doesn't use decimals, so we only keep digits.
 */
export const parseCurrency = (value: string): number => {
  const cleaned = value.replace(/[^\d]/g, '');
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Format amount for input field (adds thousand separators).
 */
export const formatAmountInput = (value: string): string => {
  const number = parseCurrency(value);
  if (isNaN(number) || number === 0) return '';

  return number.toLocaleString('vi-VN');
};

/**
 * Validate if amount is within acceptable range.
 */
export const isValidAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 999_999_999_999;
};
