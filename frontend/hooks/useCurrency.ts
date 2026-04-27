import { useCurrencyStore } from "@/store/currencyStore";
import { getCurrency, formatWithCurrency } from "@/lib/currencies";

export function useCurrency() {
  const code = useCurrencyStore((s) => s.code);
  const currency = getCurrency(code);

  const format = (amountPKR: number) => formatWithCurrency(amountPKR, currency);

  return { currency, code, format };
}
