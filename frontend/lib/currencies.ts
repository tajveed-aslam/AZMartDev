export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rateFromPKR: number; // 1 PKR = rateFromPKR units of this currency
  decimals: number;
}

// Approximate mid-market rates — PKR as base (1 PKR → X foreign)
export const CURRENCIES: Currency[] = [
  { code: "PKR", name: "Pakistani Rupee",  symbol: "Rs",   flag: "🇵🇰", rateFromPKR: 1,         decimals: 0 },
  { code: "USD", name: "US Dollar",        symbol: "$",    flag: "🇺🇸", rateFromPKR: 0.003597,  decimals: 2 },
  { code: "EUR", name: "Euro",             symbol: "€",    flag: "🇪🇺", rateFromPKR: 0.003315,  decimals: 2 },
  { code: "GBP", name: "British Pound",    symbol: "£",    flag: "🇬🇧", rateFromPKR: 0.002837,  decimals: 2 },
  { code: "AED", name: "UAE Dirham",       symbol: "د.إ",  flag: "🇦🇪", rateFromPKR: 0.013215,  decimals: 2 },
  { code: "SAR", name: "Saudi Riyal",      symbol: "﷼",    flag: "🇸🇦", rateFromPKR: 0.013490,  decimals: 2 },
  { code: "QAR", name: "Qatari Riyal",     symbol: "ر.ق",  flag: "🇶🇦", rateFromPKR: 0.013101,  decimals: 2 },
  { code: "KWD", name: "Kuwaiti Dinar",    symbol: "د.ك",  flag: "🇰🇼", rateFromPKR: 0.001104,  decimals: 3 },
  { code: "CAD", name: "Canadian Dollar",  symbol: "C$",   flag: "🇨🇦", rateFromPKR: 0.004898,  decimals: 2 },
  { code: "AUD", name: "Australian Dollar",symbol: "A$",   flag: "🇦🇺", rateFromPKR: 0.005514,  decimals: 2 },
  { code: "JPY", name: "Japanese Yen",     symbol: "¥",    flag: "🇯🇵", rateFromPKR: 0.54720,   decimals: 0 },
  { code: "CNY", name: "Chinese Yuan",     symbol: "¥",    flag: "🇨🇳", rateFromPKR: 0.026042,  decimals: 2 },
  { code: "INR", name: "Indian Rupee",     symbol: "₹",    flag: "🇮🇳", rateFromPKR: 0.30211,   decimals: 2 },
  { code: "TRY", name: "Turkish Lira",     symbol: "₺",    flag: "🇹🇷", rateFromPKR: 0.11963,   decimals: 2 },
];

export const DEFAULT_CURRENCY = CURRENCIES[0]; // PKR

export function getCurrency(code: string): Currency {
  return CURRENCIES.find((c) => c.code === code) ?? DEFAULT_CURRENCY;
}

export function convertFromPKR(amountPKR: number, currency: Currency): number {
  return amountPKR * currency.rateFromPKR;
}

export function formatWithCurrency(amountPKR: number, currency: Currency): string {
  const converted = convertFromPKR(amountPKR, currency);
  const formatted = converted.toLocaleString("en-US", {
    minimumFractionDigits: currency.decimals,
    maximumFractionDigits: currency.decimals,
  });
  return `${currency.symbol} ${formatted}`;
}
