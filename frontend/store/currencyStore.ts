import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CurrencyStore {
  code: string;
  setCode: (code: string) => void;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      code: "PKR",
      setCode: (code) => set({ code }),
    }),
    { name: "azmart_currency", skipHydration: true }
  )
);
