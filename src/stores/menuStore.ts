import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type MenuStore = {
  currentGame: string;
  currentMenu: string;
  setCurrentGame: (game: string) => void;
  setMenu: (menu: string) => void;
};

export const useMenuStore = create<MenuStore>()(
  devtools(
    immer((set) => ({
      currentGame: "lol",
      currentMenu: "find",
      setCurrentGame: (game) => set({ currentGame: game }),
      setMenu: (menu) => set({ currentMenu: menu }),
    })),
  ),
);

type MyProfileMenuStore = {
  currentMenu: string;
  setMenu: (menu: string) => void;
};

export const useMyProfileMenuStore = create<MyProfileMenuStore>()(
  devtools(
    immer((set) => ({
      currentMenu: "account",
      setMenu: (menu) => set({ currentMenu: menu }),
    })),
  ),
);
