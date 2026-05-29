"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

/* ── Path config ── */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const VIDEO_SRC = `${BASE_PATH}/BG.mp4`;

if (process.env.NODE_ENV === "development") {
  console.log("[SilkVideoBackground] VIDEO_SRC:", VIDEO_SRC);
}

const PLAYBACK_RATE = 0.6;
const LOOP_FADE_DURATION = 0.8;
const PARALLAX_STRENGTH = 35;

/* ── Canvas Fluid Animation ── */
function useCanvasFluid(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  paused: boolean,
  mouseFlowRef: React.RefObject<{ x: number; y: number }>
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

      const mx = mouseFlowRef.current.x;
      const my = mouseFlowRef.current.y;

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = (i / cols) * w;
          const y = (j / rows) * h;

          const dx = (x - mx) / w;
          const dy = (y - my) / h;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mouseInfluence = Math.max(0, 1 - dist * 1.5) * 0.8;

          const n =
            Math.sin(i * 0.3 + time + dx * mouseInfluence) * Math.cos(j * 0.3 + time * 0.7 + dy * mouseInfluence) +
            Math.sin(i * 0.15 - time * 0.5) * 0.5 +
            Math.cos(j * 0.2 + time * 1.2) * 0.5 +
            mouseInfluence * 0.4;

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
  const glowRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [loopFade, setLoopFade] = useState(false);

  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const mouseFlowRef = useRef({ x: -1000, y: -1000 });
  const videoOffsetRef = useRef({ x: 0, y: 0 });
  const glowPosRef = useRef({ x: -1000, y: -1000 });
  const videoBrightnessRef = useRef(1);
  const rafRef = useRef<number>(0);

  useCanvasFluid(canvasRef, reducedMotion, mouseFlowRef);

  // Reduced motion detection
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onMotionChange);
    return () => mq.removeEventListener("change", onMotionChange);
  }, []);

  // Video playback + seamless loop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = PLAYBACK_RATE;

    const tryPlay = () => {
      video.play().catch((err) => {
        console.warn("[SilkVideoBackground] autoplay blocked:", err);
      });
    };

    const onLoadedData = () => { setVideoReady(true); setVideoError(false); tryPlay(); };
    const onCanPlay = () => { setVideoReady(true); setVideoError(false); tryPlay(); };
    const onError = () => {
      setVideoError(true); setVideoReady(false);
      console.warn("[SilkVideoBackground] video failed:", VIDEO_SRC);
    };

    const onTimeUpdate = () => {
      const timeToEnd = video.duration - video.currentTime;
      setLoopFade(timeToEnd <= LOOP_FADE_DURATION);
    };

    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("error", onError);
    video.addEventListener("timeupdate", onTimeUpdate);

    if (!reducedMotion) tryPlay();
    const onInteract = () => { if (!reducedMotion) tryPlay(); };
    window.addEventListener("click", onInteract, { once: true });

    return () => {
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("error", onError);
      video.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [reducedMotion]);

  // Mouse parallax + glow + flow
  const tick = useCallback(() => {
    const { x, y, active } = mouseRef.current;
    const video = videoRef.current;
    const glow = glowRef.current;
    if (!glow) return;

    const lerpSpeed = reducedMotion ? 0.02 : 0.07;

    if (!active) {
      videoOffsetRef.current.x += (0 - videoOffsetRef.current.x) * lerpSpeed * 0.4;
      videoOffsetRef.current.y += (0 - videoOffsetRef.current.y) * lerpSpeed * 0.4;
      glowPosRef.current.x += (-1000 - glowPosRef.current.x) * 0.04;
      glowPosRef.current.y += (-1000 - glowPosRef.current.y) * 0.04;
      mouseFlowRef.current.x += (-1000 - mouseFlowRef.current.x) * 0.04;
      mouseFlowRef.current.y += (-1000 - mouseFlowRef.current.y) * 0.04;
      videoBrightnessRef.current += (1 - videoBrightnessRef.current) * 0.05;
    } else {
      const px = (x / window.innerWidth - 0.5) * -PARALLAX_STRENGTH;
      const py = (y / window.innerHeight - 0.5) * -PARALLAX_STRENGTH;
      videoOffsetRef.current.x += (px - videoOffsetRef.current.x) * lerpSpeed;
      videoOffsetRef.current.y += (py - videoOffsetRef.current.y) * lerpSpeed;
      glowPosRef.current.x += (x - glowPosRef.current.x) * 0.1;
      glowPosRef.current.y += (y - glowPosRef.current.y) * 0.1;
      mouseFlowRef.current.x += (x - mouseFlowRef.current.x) * 0.05;
      mouseFlowRef.current.y += (y - mouseFlowRef.current.y) * 0.05;
      const targetBrightness = 1 + 0.08 * Math.max(0, 1 - Math.abs(px) / PARALLAX_STRENGTH);
      videoBrightnessRef.current += (targetBrightness - videoBrightnessRef.current) * 0.06;
    }

    if (video) {
      video.style.transform = `scale(1.08) translate(${videoOffsetRef.current.x}px, ${videoOffsetRef.current.y}px)`;
      video.style.filter = `saturate(0.4) contrast(1.05) brightness(${videoBrightnessRef.current.toFixed(2)})`;
    }
    glow.style.left = `${glowPosRef.current.x}px`;
    glow.style.top = `${glowPosRef.current.y}px`;
    glow.style.opacity = active ? "0.6" : "0";
  }, [reducedMotion]);

  useEffect(() => {
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
  }, [tick]);

  const baseOpacity = videoReady && !videoError && !reducedMotion ? 0.65 : 0;
  const videoOpacity = loopFade ? baseOpacity * 0.7 : baseOpacity;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      {/* Base color */}
      <div style={{ position: "absolute", inset: 0, background: "#0F0F12", zIndex: 0 }} />

      {/* Canvas fluid */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.5, zIndex: 1 }}
      />

      {/* Fallback when video fails */}
      {videoError && (
        <div aria-hidden style={{
          position: "absolute", inset: 0, zIndex: 2,
          background: "linear-gradient(135deg, rgba(30,30,40,0.2), rgba(20,20,28,0.15))"
        }} />
      )}

      {/* Video layer */}
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        autoPlay loop muted playsInline preload="auto"
        onLoadedData={() => { setVideoReady(true); setVideoError(false); }}
        onCanPlay={() => { setVideoReady(true); setVideoError(false); }}
        onError={() => { setVideoError(true); setVideoReady(false); console.warn("[SilkVideoBackground] video failed:", VIDEO_SRC); }}
        style={{
          position: "absolute", inset: "-5%", width: "110%", height: "110%",
          objectFit: "cover", opacity: videoOpacity, zIndex: 2,
          transition: "opacity 0.6s ease", willChange: "transform, filter",
        }}
      />

      {/* Fog overlay — hazy, dark-tinted diffusion */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 30%, rgba(15,15,18,0.0) 0%, rgba(15,15,18,0.6) 100%)",
        backdropFilter: "blur(1px)",
      }} />

      {/* Page tint */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none",
        background: "linear-gradient(180deg, rgba(15,15,18,0.1) 0%, rgba(15,15,18,0.3) 100%)",
      }} />

      {/* Mouse glow */}
      <div
        ref={glowRef}
        style={{
          position: "absolute", width: "600px", height: "600px", borderRadius: "50%",
          transform: "translate(-50%, -50%)", pointerEvents: "none", opacity: 0,
          transition: "opacity 0.5s ease", zIndex: 5,
          background: "radial-gradient(circle, rgba(180,190,205,0.12) 0%, transparent 65%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 6, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 40%, transparent 50%, rgba(15,15,18,0.5) 100%)",
      }} />

      {/* Grain */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.035, zIndex: 7, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat", backgroundSize: "128px 128px",
        mixBlendMode: "overlay",
      }} />
    </div>
  );
}
