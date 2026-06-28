"use client";

import { useEffect, useRef } from "react";

type ScrollVideoProps = {
  /** Scroll-scrubbed video (frame follows scroll position). */
  src: string;
  /** Optional always-playing base video rendered underneath. */
  baseSrc?: string;
  /** Blend mode applied to the scrubbed video so it composites over the base. */
  blendClassName?: string;
  overlayClassName?: string;
};

export default function ScrollVideo({
  src,
  baseSrc,
  blendClassName = "mix-blend-screen",
  overlayClassName = "bg-[linear-gradient(180deg,_rgba(7,21,38,0.5),_rgba(7,21,38,0.72))]",
}: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTime = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId = 0;

    const computeTarget = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0;
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      targetTime.current = progress * duration;
    };

    // Ease currentTime toward the scroll target each frame so scrubbing glides
    // instead of snapping, and we stop seeking once it has settled.
    const tick = () => {
      if (video.readyState >= 2) {
        const diff = targetTime.current - video.currentTime;
        if (Math.abs(diff) > 0.01) {
          video.currentTime += diff * 0.12;
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    // Priming play()/pause() makes mobile Safari actually paint seeked frames.
    const prime = () => {
      video.play().then(() => video.pause()).catch(() => {});
      computeTarget();
    };

    video.addEventListener("loadedmetadata", computeTarget);
    video.addEventListener("loadeddata", prime, { once: true });
    window.addEventListener("scroll", computeTarget, { passive: true });
    window.addEventListener("resize", computeTarget);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener("loadedmetadata", computeTarget);
      window.removeEventListener("scroll", computeTarget);
      window.removeEventListener("resize", computeTarget);
    };
  }, []);

  return (
    <>
      {baseSrc && (
        <video
          className="fixed inset-0 -z-30 h-full w-full object-cover brightness-[0.55] saturate-[1.1]"
          src={baseSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      )}
      <video
        ref={videoRef}
        className={`fixed inset-0 -z-20 h-full w-full object-cover ${blendClassName}`}
        src={src}
        muted
        playsInline
        preload="auto"
      />
      <div className={`fixed inset-0 -z-10 ${overlayClassName}`} />
    </>
  );
}
