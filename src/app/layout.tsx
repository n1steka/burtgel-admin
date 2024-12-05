"use client";
import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { AuthProvider } from "../context/AuthContext";
import { getRealData } from "@/utils/storage";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "antd";
const inter = Inter({ subsets: ["latin"] });

const { Content } = Layout;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hideSidebarRoutes = ["/sign-in"];
  const pathName = usePathname();
  const showSidebar = !hideSidebarRoutes.includes(pathName);
  const token = getRealData("token");
  const router = useRouter();
  useEffect(() => {
    if (!token) {
      router.push("/sign-in");
    }
  }, [token]);
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          <Layout>
            {showSidebar && <Sidebar />}
            <Layout>
              <Content className={`${showSidebar ? "" : ""}`}>
                {children}
              </Content>
            </Layout>
          </Layout>
        </body>
      </AuthProvider>
    </html>
  );
}
