/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Home,
  LayoutDashboard,
  Users,
  FolderKanban,
  Calendar,
  ClipboardList,
  MessageSquare,
  BarChart3,
  Settings,
  FileText,
  UserCog,
  Tags,
  Bell,
  Briefcase,
} from "lucide-react";

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

export function getMenuList(pathname: string): Group[] {
  const menuItems: Group[] = [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      groupLabel: "Tasks",
      menus: [
        {
          href: "/tasks",
          label: "All Tasks",
          icon: ClipboardList,
        },
        // {
        //   href: "/projects",
        //   label: "Projects",
        //   icon: FolderKanban,
        //   submenus: [
        //     { href: "/projects/active", label: "Active Projects" },
        //     { href: "/projects/completed", label: "Completed Projects" },
        //   ],
        // },
        {
          href: "/calendar",
          label: "Calendar View",
          icon: Calendar,
        },
        {
          href: "/tags",
          label: "Tags & Labels",
          icon: Tags,
        },
      ],
    },
    {
      groupLabel: "Teams",
      menus: [
        {
          href: "/teams",
          label: "All Teams",
          icon: Users,
        },
        {
          href: "/members",
          label: "Members",
          icon: UserCog,
        },
      ],
    },
    {
      groupLabel: "Communication",
      menus: [
        {
          href: "/chat",
          label: "Chat",
          icon: MessageSquare,
        },
        // {
        //   href: "/notifications",
        //   label: "Notifications",
        //   icon: Bell,
        // },
      ],
    },
    {
      groupLabel: "Reports",
      menus: [
        {
          href: "/reports",
          label: "Overview",
          icon: BarChart3,
        },
        {
          href: "/reports/timesheet",
          label: "Timesheet",
          icon: FileText,
        },
      ],
    },
    {
      groupLabel: "Settings",
      menus: [
        // {
        //   href: "/settings/workspace",
        //   label: "Workspace Settings",
        //   icon: Briefcase,
        // },
        {
          href: "/settings/app",
          label: "App Settings",
          icon: Settings,
        },
      ],
    },
  ];

  return menuItems;
}
