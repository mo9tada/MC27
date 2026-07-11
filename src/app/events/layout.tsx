import Navbar from "@/components/navbar";
import VideoBackground from "@/components/video-background";

// Shared shell for the events list and detail pages. Keeping the Navbar and
// overlay here (instead of inside each page) means the loading.tsx skeletons
// swap only the content area — the navbar persists and doesn't re-animate, so
// navigations feel instant and smooth.
export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-x-hidden text-white">
      <VideoBackground overlayClassName="bg-[linear-gradient(180deg,_rgba(7,21,38,0.9),_rgba(16,44,78,0.92))]" blobs />
      <Navbar />
      {children}
    </main>
  );
}
