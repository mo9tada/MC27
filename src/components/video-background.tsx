type VideoBackgroundProps = {
  overlayClassName?: string;
  blobs?: boolean;
};

export default function VideoBackground({
  overlayClassName = "bg-[linear-gradient(180deg,_rgba(7,21,38,0.82),_rgba(16,44,78,0.88))]",
  blobs = false,
}: VideoBackgroundProps) {
  // The background <video> now lives once in the root layout (SiteBackground) so
  // it persists across navigations. This component only paints the per-page
  // gradient overlay (+ optional decorative blobs) over that shared video.
  return (
    <>
      <div className={`fixed inset-0 -z-10 ${overlayClassName}`} />

      {blobs && (
        <>
          <div
            aria-hidden
            className="animate-pulse fixed -left-32 top-1/4 -z-10 size-72 rounded-full bg-[#c58d5a]/20 blur-3xl"
            style={{ animationDuration: "8s" }}
          />
          <div
            aria-hidden
            className="animate-pulse fixed -right-24 top-1/2 -z-10 size-96 rounded-full bg-[#163b66]/30 blur-3xl"
            style={{ animationDuration: "10s" }}
          />
        </>
      )}
    </>
  );
}
