"use client";

import React, { useEffect, useRef, useState } from "react";

/* ── Path config ── */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const VIDEO_SRC = `${BASE_PATH}/BG.mp4`;

if (process.env.NODE_ENV === "development") {
  console.log("[SilkVideoBackground] VIDEO_SRC:", VIDEO_SRC);
}

/* ── Canvas Fluid Animation (ambient only, no interaction) ── */
function useCanvasFluid(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  paused: boolean
) {
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const cols = 30;
    const rows = 20;
    let time = 0;

    const draw = () => {
      if (!paused) time += 0.002;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = (i / cols) * w;
          const y = (j / rows) * h;

          const n =
            Math.sin(i * 0.3 + time) * Math.cos(j * 0.3 + time * 0.7) +
            Math.sin(i * 0.15 - time * 0.5) * 0.5 +
            Math.cos(j * 0.2 + time * 1.2) * 0.5;

          const alpha = (n + 1.5) * 0.04;
          const r = 18 + 12 * n;
          const g = 18 + 14 * n;
          const b = 22 + 16 * n;

          ctx.fillStyle = `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, w / cols * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [paused]);
}

export default function SilkVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const rafRef = useRef<number>(0);

  useCanvasFluid(canvasRef, reducedMotion);

  // Reduced motion detection
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onMotionChange);
    return () => mq.removeEventListener("change", onMotionChange);
  }, []);

  // Video init: kickstart decoder so currentTime seeks visually render
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let decoderPrimed = false;

    const primeDecoder = async () => {
      if (decoderPrimed || !video.duration) return;
      decoderPrimed = true;
      try {
        // Play briefly to initialize the video decoder, then immediately pause
        await video.play();
        // Wait one frame so the decoder actually starts
        await new Promise((r) => requestAnimationFrame(r));
        video.pause();
        setVideoReady(true);
        setVideoError(false);
        // Initial seek to scroll position
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        if (maxScroll > 0 && video.duration) {
          video.currentTime = (window.scrollY / maxScroll) * video.duration;
        }
      } catch (err) {
        console.warn("[SilkVideoBackground] decoder prime failed:", err);
        // Fallback: mark ready anyway, seeking may still work in some browsers
        setVideoReady(true);
        setVideoError(false);
      }
    };

    const onLoadedData = () => { primeDecoder(); };
    const onCanPlay = () => { primeDecoder(); };
    const onError = () => {
      setVideoError(true);
      setVideoReady(false);
      console.warn("[SilkVideoBackground] video failed:", VIDEO_SRC);
    };

    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("error", onError);

    return () => {
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("error", onError);
    };
  }, []);

  // Scroll-driven video scrubbing
  useEffect(() => {
    if (reducedMotion || !videoReady) return;

    const video = videoRef.current;
    if (!video) return;

    let ticking = false;

    const updateVideoFromScroll = () => {
      if (!video.duration) return;

      const maxScroll = document.body.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      video.currentTime = progress * video.duration;
    };

    const onScroll = () => {
      if (!ticking) {
        rafRef.current = requestAnimationFrame(() => {
          updateVideoFromScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Initial sync
    updateVideoFromScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion, videoReady]);

  const baseOpacity = videoReady && !videoError && !reducedMotion ? 0.45 : 0;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      {/* Base color */}
      <div style={{ position: "absolute", inset: 0, background: "#0F0F12", zIndex: 0 }} />

      {/* Canvas fluid — subtle ambient motion */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.25, zIndex: 1 }}
      />

      {/* Fallback when video fails */}
      {videoError && (
        <div aria-hidden style={{
          position: "absolute", inset: 0, zIndex: 2,
          background: "linear-gradient(135deg, rgba(30,30,40,0.2), rgba(20,20,28,0.15))"
        }} />
      )}

      {/* Video layer — scroll-driven, paused, time managed by scroll position */}
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        muted playsInline preload="auto"
        onLoadedData={() => { setVideoReady(true); setVideoError(false); }}
        onCanPlay={() => { setVideoReady(true); setVideoError(false); }}
        onError={() => { setVideoError(true); setVideoReady(false); console.warn("[SilkVideoBackground] video failed:", VIDEO_SRC); }}
        style={{
          position: "absolute", inset: "-5%", width: "110%", height: "110%",
          objectFit: "cover", opacity: baseOpacity, zIndex: 2,
          transition: "opacity 0.6s ease",
        }}
      />

      {/* Fog overlay — much lighter since video is B&W */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 30%, rgba(15,15,18,0.0) 0%, rgba(15,15,18,0.12) 100%)",
        backdropFilter: "blur(0.5px)",
      }} />

      {/* Page tint — lighter */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none",
        background: "linear-gradient(180deg, rgba(15,15,18,0.05) 0%, rgba(15,15,18,0.15) 100%)",
      }} />

      {/* Vignette — very light */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 40%, transparent 65%, rgba(15,15,18,0.12) 100%)",
      }} />

      {/* Grain */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.025, zIndex: 6, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat", backgroundSize: "128px 128px",
        mixBlendMode: "overlay",
      }} />
    </div>
  );
}
