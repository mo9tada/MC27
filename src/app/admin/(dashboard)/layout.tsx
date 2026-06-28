import { verifyAdminSession } from "@/lib/dal";
import VideoBackground from "@/components/video-background";
import AdminNav from "../admin-nav";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  await verifyAdminSession();

  return (
    <div className="relative flex min-h-screen flex-col text-white sm:flex-row">
      <VideoBackground overlayClassName="bg-[linear-gradient(180deg,_rgba(7,21,38,0.94),_rgba(16,44,78,0.94))]" />
      <AdminNav />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
