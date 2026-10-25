import type { Metadata, Viewport } from "next";
import { verifyAdminSession } from "@/lib/dal";
import VideoBackground from "@/components/video-background";
import AdminNav from "../admin-nav";

export const metadata: Metadata = {
  title: "MC27 Admin",
  manifest: "/admin.webmanifest",
  appleWebApp: { capable: true, title: "MC27 Admin", statusBarStyle: "black-translucent" },
  icons: { apple: "/admin-icon-192.png" },
};

export const viewport: Viewport = {
  themeColor: "#0b1f38",
};

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  await verifyAdminSession();

  return (
    <div className="dark relative flex min-h-screen flex-col text-white sm:flex-row">
      <VideoBackground overlayClassName="bg-[linear-gradient(180deg,_rgba(7,21,38,0.94),_rgba(16,44,78,0.94))]" />
      <AdminNav />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
