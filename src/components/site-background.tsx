// Persistent, route-independent background. Rendered ONCE in the root layout so
// it never unmounts between navigations — page transitions stay instant with no
// video reload/poster-flash. Plain markup (no hooks) so it stays a Server
// Component and ships zero client JS. Sits at the very back (-z-40); each page's
// gradient overlay (see VideoBackground) paints on top at -z-10.
//
// Scroll stability:
// - h-lvh (large viewport height) instead of h-full: on mobile the browser
//   toolbar collapses while scrolling, which resized an inset-0 box and made
//   object-cover re-crop the video every scroll — the visible "jump"/lag.
//   lvh is the height with the toolbar hidden, so the box never changes size.
// - transform-gpu + will-change + contain: the video gets its own compositor
//   layer, so scrolling the page just moves other layers over it instead of
//   repainting the video.
export default function SiteBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 -z-[40] h-lvh w-full overflow-hidden transform-gpu will-change-transform [contain:strict]"
    >
      <video
        className="h-full w-full object-cover"
        poster="/bg-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/bg.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
