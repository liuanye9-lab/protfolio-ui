"use client";

import React, { useEffect, useRef, useState } from "react";

/* ── Path config ── */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const VIDEO_SRC = `${BASE_PATH}/BG.mp4`;

if (process.env.NODE_ENV === "development") {
  console.log("[SilkVideoBackground] VIDEO_SRC:", VIDEO_SRC);
}

/* ── Canvas Fluid Animation (always works as base layer) ── */
function useCanvasFluid(canvasRef: React.RefObject<HTMLCanvasElement | null>, isLight: boolean, paused: boolean) {
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
      if (!paused) time += 0.003;
      ctx.clearRect(0, 0, w, h);

      const baseR = isLight ? 228 : 18;
      const baseG = isLight ? 224 : 18;
      const baseB = isLight ? 218 : 22;

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = (i / cols) * w;
          const y = (j / rows) * h;
          const n =
            Math.sin(i * 0.3 + time) * Math.cos(j * 0.3 + time * 0.7) +
            Math.sin(i * 0.15 - time * 0.5) * 0.5 +
            Math.cos(j * 0.2 + time * 1.2) * 0.5;

          const alpha = (n + 1.5) * 0.04;
          const r = baseR + (isLight ? -8 : 12) * n;
          const g = baseG + (isLight ? -6 : 14) * n;
          const b = baseB + (isLight ? -4 : 16) * n;

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
  }, [isLight, paused]);
}

export default function SilkVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLight, setIsLight] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const videoOffsetRef = useRef({ x: 0, y: 0 });
  const glowPosRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);

  // Canvas fluid base layer (paused when reduced motion)
  useCanvasFluid(canvasRef, isLight, reducedMotion);

  // Theme + reduced motion
  useEffect(() => {
    const getTheme = () => document.documentElement.getAttribute("data-theme") === "light";
    setIsLight(getTheme());

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onMotionChange);

    const observer = new MutationObserver(() => setIsLight(getTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      observer.disconnect();
      mq.removeEventListener("change", onMotionChange);
    };
  }, []);

  // Video playback with full state tracking
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      video.play().catch((err) => {
        console.warn("[SilkVideoBackground] autoplay blocked or failed:", err);
      });
    };

    const onLoadedData = () => {
      setVideoReady(true);
      setVideoError(false);
      tryPlay();
    };

    const onCanPlay = () => {
      setVideoReady(true);
      setVideoError(false);
      tryPlay();
    };

    const onError = () => {
      setVideoError(true);
      setVideoReady(false);
      console.warn("[SilkVideoBackground] video failed to load:", VIDEO_SRC);
    };

    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("error", onError);

    // Don't play if reduced motion
    if (!reducedMotion) {
      tryPlay();
    }

    const onInteract = () => { if (!reducedMotion) tryPlay(); };
    window.addEventListener("click", onInteract, { once: true });
    window.addEventListener("scroll", onInteract, { once: true });

    return () => {
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("error", onError);
    };
  }, [reducedMotion]);

  // Mouse parallax + glow (weakened if reduced motion)
  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const parallaxStrength = reducedMotion ? 0 : 20;
    const lerpSpeed = reducedMotion ? 0.02 : 0.08;
    const glowLerp = reducedMotion ? 0.03 : 0.12;
    const glowMaxOpacity = reducedMotion ? 0.2 : 0.6;

    const tick = () => {
      const { x, y, active } = mouseRef.current;
      const video = videoRef.current;

      if (!active) {
        videoOffsetRef.current.x += (0 - videoOffsetRef.current.x) * lerpSpeed * 0.4;
        videoOffsetRef.current.y += (0 - videoOffsetRef.current.y) * lerpSpeed * 0.4;
        glowPosRef.current.x += (-1000 - glowPosRef.current.x) * 0.05;
        glowPosRef.current.y += (-1000 - glowPosRef.current.y) * 0.05;
      } else {
        videoOffsetRef.current.x += ((x / window.innerWidth - 0.5) * -parallaxStrength - videoOffsetRef.current.x) * lerpSpeed;
        videoOffsetRef.current.y += ((y / window.innerHeight - 0.5) * -parallaxStrength - videoOffsetRef.current.y) * lerpSpeed;
        glowPosRef.current.x += (x - glowPosRef.current.x) * glowLerp;
        glowPosRef.current.y += (y - glowPosRef.current.y) * glowLerp;
      }

      if (video) {
        video.style.transform = `scale(1.08) translate(${videoOffsetRef.current.x}px, ${videoOffsetRef.current.y}px)`;
      }
      glow.style.left = `${glowPosRef.current.x}px`;
      glow.style.top = `${glowPosRef.current.y}px`;
      glow.style.opacity = active ? (isLight ? "0.5" : String(glowMaxOpacity)) : "0";
    };

    let ticking = false;
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
      if (!ticking) {
        rafRef.current = requestAnimationFrame(() => { ticking = false; tick(); });
        ticking = true;
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    const idle = () => { if (!mouseRef.current.active) tick(); rafRef.current = requestAnimationFrame(idle); };
    rafRef.current = requestAnimationFrame(idle);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isLight, reducedMotion]);

  const videoOpacity = videoReady && !videoError && !reducedMotion ? (isLight ? 0.5 : 0.65) : 0;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* ── Base solid color ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isLight ? "#F5F2EC" : "#0F0F12",
          zIndex: 0,
        }}
      />

      {/* ── Canvas fluid layer (always active) ── */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: isLight ? 0.6 : 0.5,
          zIndex: 1,
        }}
      />

      {/* ── Fallback poster (shown when video errors) ── */}
      {videoError && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: isLight
              ? "linear-gradient(135deg, rgba(200,190,175,0.15), rgba(220,215,205,0.1))"
              : "linear-gradient(135deg, rgba(30,30,40,0.2), rgba(20,20,28,0.15))",
            zIndex: 2,
          }}
        />
      )}

      {/* ── Video layer ── */}
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={() => {
          setVideoReady(true);
          setVideoError(false);
        }}
        onCanPlay={() => {
          setVideoReady(true);
          setVideoError(false);
        }}
        onError={() => {
          setVideoError(true);
          setVideoReady(false);
          console.warn("[SilkVideoBackground] video failed to load:", VIDEO_SRC);
        }}
        style={{
          position: "absolute",
          inset: "-5%",
          width: "110%",
          height: "110%",
          objectFit: "cover",
          opacity: videoOpacity,
          filter: isLight
            ? "saturate(0.5) contrast(0.85) brightness(1.1)"
            : "saturate(0.4) contrast(1.05) brightness(0.95)",
          transition: "opacity 1s ease",
          willChange: "transform",
          zIndex: 2,
        }}
      />

      {/* ── Page tint overlay ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isLight
            ? "linear-gradient(180deg, rgba(245,242,236,0.2) 0%, rgba(245,242,236,0.3) 100%)"
            : "linear-gradient(180deg, rgba(15,15,18,0.1) 0%, rgba(15,15,18,0.3) 100%)",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />

      {/* ── Mouse glow ── */}
      <div
        ref={glowRef}
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 0.5s ease",
          background: isLight
            ? "radial-gradient(circle, rgba(100,115,135,0.15) 0%, transparent 65%)"
            : "radial-gradient(circle, rgba(180,190,205,0.12) 0%, transparent 65%)",
          mixBlendMode: isLight ? "multiply" : "screen",
          zIndex: 4,
        }}
      />

      {/* ── Soft vignette ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isLight
            ? "radial-gradient(ellipse at 50% 40%, transparent 50%, rgba(245,242,236,0.45) 100%)"
            : "radial-gradient(ellipse at 50% 40%, transparent 50%, rgba(15,15,18,0.5) 100%)",
          zIndex: 5,
          pointerEvents: "none",
          transition: "background 0.8s ease",
        }}
      />

      {/* ── Subtle grain ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: isLight ? 0.025 : 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
          mixBlendMode: isLight ? "multiply" : "overlay",
          zIndex: 6,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
