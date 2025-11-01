import { ToastProvider } from "@heroui/toast";

import { Providers } from "./providers";

import { SideBar, userMenuLists } from "@/components/common/sideBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
      <ToastProvider placement="top-right" toastProps={{ timeout: 3000 }} />
      <SideBar baseMenuList={userMenuLists} menuTitle="User" />
      <div className="relative flex flex-col lg:pl-64">
        <main className="flex-grow w-full">{children}</main>
      </div>
    </Providers>
  );
}
