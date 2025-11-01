import { ToastProvider } from "@heroui/toast";

import { Providers } from "./providers";

import { SideBar, adminMenuLists } from "@/components/common/sideBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
      <ToastProvider placement="top-right" toastProps={{ timeout: 3000 }} />
      <SideBar baseMenuList={adminMenuLists} menuTitle="Admin" />
      <div className="relative flex flex-col lg:pl-64">
        <main className="flex-grow w-full">{children}</main>
      </div>
    </Providers>
  );
}
