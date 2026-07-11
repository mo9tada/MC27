// Persistent, route-independent background. Rendered ONCE in the root layout so
// it never unmounts between navigations — page transitions stay instant with no
// video reload/poster-flash. Plain markup (no hooks) so it stays a Server
// Component and ships zero client JS. Sits at the very back (-z-40); each page's
// gradient overlay (see VideoBackground) paints on top at -z-10.
export default function SiteBackground() {
  return (
    <video
      className="fixed inset-0 -z-[40] h-full w-full object-cover"
      poster="/bg-poster.jpg"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
    >
      <source src="/bg.mp4" type="video/mp4" />
    </video>
  );
}
