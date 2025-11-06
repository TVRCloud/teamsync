/* eslint-disable @typescript-eslint/no-explicit-any */
import { canAccessRoute } from "@/utils/check-access";
import { useAuth } from "./useUser";
import { menuList } from "@/lib/menu-list";

export type Submenu = {
  href: string;
  label: string;
  active?: boolean;
  icon?: React.ComponentType<any>;
  submenus?: InsideMenu[];
};

export type InsideMenu = {
  href: string;
  label: string;
  active?: boolean;
  icon?: React.ComponentType<any>;
  submenus?: Submenu[];
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: React.ComponentType<any>;
  submenus?: InsideMenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function useMenuList(): Group[] {
  const { user, isLoading } = useAuth();
  if (isLoading) return [];

  const menuItems: Group[] = menuList;

  const filterMenuByAccess = (menus: any[], role?: string): any[] => {
    return menus
      .map((menu) => {
        const canAccess = canAccessRoute({
          path: menu.href,
          role,
        });

        let filteredSub: any[] = [];
        if (menu.submenus) {
          filteredSub = filterMenuByAccess(menu.submenus, role);
        }

        if (!menu.href) {
          return filteredSub.length > 0
            ? { ...menu, submenus: filteredSub }
            : null;
        }

        if (canAccess || filteredSub.length > 0) {
          return { ...menu, submenus: filteredSub };
        }

        return null;
      })
      .filter(Boolean);
  };

  return menuItems
    .map((group) => ({
      ...group,
      menus: filterMenuByAccess(group.menus, user?.role),
    }))
    .filter((group) => group.menus.length > 0);
}
