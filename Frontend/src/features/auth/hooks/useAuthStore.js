import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const initialState = {
  token: null,
  email: null,
  roles: [],
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      ...initialState,
      setAuth: ({ token, email, roles }) => {
        set({ token, email, roles: roles || [] });
      },
      clearAuth: () => set({ ...initialState }),
      getToken: () => get().token,
      isAuthenticated: () => Boolean(get().token),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ token: state.token, email: state.email, roles: state.roles }),
    }
  )
);

export default useAuthStore;


