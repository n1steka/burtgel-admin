"use client";
import * as React from "react";
import { BookOpen, Command, Layout, PieChart, LogOut } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Layout as AntLayout, Menu } from "antd";

const { Sider } = AntLayout;

interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
}

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      key: "",
      label: "Үндсэн",
      icon: <PieChart size={18} />,
    },
    {
      key: "category",
      label: "Алба хэлтэс",
      icon: <Layout size={18} />,
    },
    // {
    //   key: "order",
    //   label: "Захиалга",
    //   icon: <PieChart size={18} />,
    // },
    {
      key: "product-register",
      label: "Бүтээгдэхүүн",
      icon: <BookOpen size={18} />,
    },
    {
      key: "user",
      label: "Хэрэглэгч",
      icon: <Command size={18} />,
    },
  ] as NavItem[],
};

export function Sidebar({ ...props }) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleMenuClick = (key: string) => {
    if (key === "logout") {
      logout();
    } else {
      router.push(`/${key}`);
    }
  };

  const menuItems = [
    ...data.navMain.map((item) => ({
      key: item.key,
      icon: item.icon,
      label: item.label,
    })),
    {
      key: "logout",
      icon: <LogOut size={18} />,
      label: "Гарах",
      className: "text-red-400 hover:text-red-500",
      style: {
        marginTop: "16px",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        paddingTop: "16px",
      },
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={260}
      className="min-h-screen bg-slate-900 border-r border-slate-800"
      {...props}
    >
      <div className="p-6 h-full relative">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-white">
            <Command size={20} />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-lg font-semibold text-white">Admin</h2>
              <p className="text-sm text-slate-400">Аж ахуйн нэгж</p>
            </div>
          )}
        </div>

        <Menu
          className="bg-transparent border-none"
          mode="inline"
          selectedKeys={[pathname.split("/")[1]]}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
          theme="dark"
          style={{
            fontSize: "14px",
          }}
        />
      </div>

      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-slate-800 bg-slate-900"></div>
      )}
    </Sider>
  );
}
