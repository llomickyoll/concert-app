"use client";

import { Home, Menu, X, RefreshCcw, LogOut, Inbox } from "lucide-react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import * as React from "react";
import clsx from "clsx";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

import { handleApiResponse } from "@/utils/helper";

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export const adminMenuLists: MenuItem[] = [
  {
    name: "Home",
    path: "/admin",
    icon: <Home className="w-5 h-5" />,
  },
  {
    name: "History",
    path: "/history",
    icon: <Inbox className="w-5 h-5" />,
  },
  {
    name: "Switch to User",
    path: "/main",
    icon: <RefreshCcw className="w-5 h-5" />,
  },
];

export const userMenuLists: MenuItem[] = [
  {
    name: "Home",
    path: "/main",
    icon: <Home className="w-5 h-5" />,
  },
];

const menuForIsAdmin = {
  name: "Switch to Admin",
  path: "/admin",
  icon: <RefreshCcw className="w-5 h-5" />,
};

interface SideBarProps {
  baseMenuList: MenuItem[];
  menuTitle: string;
}

export const SideBar = ({ baseMenuList, menuTitle }: SideBarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { data: session, status } = useSession();
  const isAdminSession = session?.user?.isAdmin;

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: true,
        callbackUrl: "/",
      });

      if (isMobile) {
        setIsOpen(false);
      }
    } catch (error) {
      handleApiResponse(
        error as AxiosError<{ message: string }>,
        "Failed to logout",
      );
      router.push("/");
    }
  };

  // Only add session-dependent menu items after mount
  const menuLists = useMemo(() => {
    if (!mounted) return baseMenuList;

    // Add "Switch to Admin" menu if user is admin but viewing user layout
    if (status === "authenticated" && isAdminSession) {
      const hasAdminSwitch = baseMenuList.some(
        (item) => item.path === "/admin",
      );

      if (!hasAdminSwitch) {
        return [...baseMenuList, menuForIsAdmin];
      }
    }

    return baseMenuList;
  }, [baseMenuList, mounted, status, isAdminSession]);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;

      setIsMobile(mobile);
      setIsOpen(!mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleOverlayKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeSidebar();
    }
  };

  const displayMenuLists = menuLists;

  return (
    <>
      {/* Hamburger Button */}
      {!isOpen && (
        <button
          aria-label="Toggle sidebar"
          className={clsx(
            "fixed top-4 left-4 z-50 lg:hidden",
            "flex items-center justify-center",
            "w-10 h-10 rounded-lg",
            "bg-background ",
            "text-foreground hover:bg-primary-100",
            "transition-colors shadow-md",
          )}
          onClick={toggleSidebar}
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Overlay */}
      {isOpen && isMobile && (
        <div
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          role="button"
          tabIndex={0}
          onClick={closeSidebar}
          onKeyDown={handleOverlayKeyDown}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r border-divider bg-background transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto px-3 py-4">
          <div className="mb-8 flex items-center justify-between px-3 py-2">
            <h2 className="text-xl font-bold text-foreground">{menuTitle}</h2>
            <button
              aria-label="Close sidebar"
              className={clsx(
                "lg:hidden",
                "flex items-center justify-center",
                "w-8 h-8 rounded-lg",
                "text-foreground hover:bg-default-100",
                "transition-colors",
              )}
              onClick={toggleSidebar}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="space-y-2 flex-1">
            {displayMenuLists.map((item) => {
              const isActive =
                pathname === item.path || pathname?.startsWith(`${item.path}/`);

              return (
                <NextLink
                  key={item.path}
                  className={clsx(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                    "hover:bg-primary-100",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:text-foreground",
                  )}
                  href={item.path}
                  onClick={closeSidebar}
                >
                  <span
                    className={clsx(
                      "flex items-center justify-center",
                      isActive ? "text-primary-foreground" : "text-default-500",
                    )}
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </NextLink>
              );
            })}
          </nav>
          {/* Show logout button after mount - routes are protected by middleware, so user must be authenticated */}
          {mounted && (
            <div className="mt-auto pt-4 border-t border-divider">
              <button
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors w-full",
                  "text-danger hover:bg-danger/10 hover:text-danger",
                )}
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
