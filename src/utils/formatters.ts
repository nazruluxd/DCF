export function formatCurrency(
  val: number | undefined | null,
  decimals: number = 2,
  compact: boolean = false
): string {
  if (val === undefined || val === null || isNaN(val)) return '$0.00';

  if (compact) {
    if (Math.abs(val) >= 1_000_000_000_000) {
      return `$${(val / 1_000_000_000_000).toFixed(decimals)}T`;
    }
    if (Math.abs(val) >= 1_000_000_000) {
      return `$${(val / 1_000_000_000).toFixed(decimals)}B`;
    }
    if (Math.abs(val) >= 1_000_000) {
      return `$${(val / 1_000_000).toFixed(decimals)}M`;
    }
    if (Math.abs(val) >= 1_000) {
      return `$${(val / 1_000).toFixed(decimals)}K`;
    }
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

export function formatPercent(val: number | undefined | null, decimals: number = 2): string {
  if (val === undefined || val === null || isNaN(val)) return '0.00%';
  return `${(val * 100).toFixed(decimals)}%`;
}

export function formatRawPercent(val: number | undefined | null, decimals: number = 2): string {
  if (val === undefined || val === null || isNaN(val)) return '0.00%';
  return `${val.toFixed(decimals)}%`;
}

export function formatNumber(val: number | undefined | null, decimals: number = 0): string {
  if (val === undefined || val === null || isNaN(val)) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}
