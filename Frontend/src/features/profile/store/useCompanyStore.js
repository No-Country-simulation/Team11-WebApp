// src/store/useCompanyStore.js
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCompanyStore = create(
  persist(
    (set) => ({
      company: null,

      setCompany: (company) => set({ company }),

      clearCompany: () => set({ company: null }),
    }),
    {
      name: "company-storage",
    }
  )
);
