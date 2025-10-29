// store/useUserStore.ts
import { create } from "zustand";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
};

type UserStore = {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
