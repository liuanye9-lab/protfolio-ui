"use client";

import React, { useEffect, useRef, useState } from "react";

interface CursorState {
  x: number;
  y: number;
  isHovering: boolean;
  isVisible: boolean;
}

export default function CursorAura() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<CursorState>({
    x: -100,
    y: -100,
    isHovering: false,
    isVisible: false,
  });
  const ringPosRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const [isLight, setIsLight] = useState(false);

  // Theme detection
  useEffect(() => {
    const getTheme = () => document.documentElement.getAttribute("data-theme") === "light";
    setIsLight(getTheme());

    const observer = new MutationObserver(() => setIsLight(getTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  // Cursor tracking
  useEffect(() => {
    // Only enable on desktop with fine pointer
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHovering =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") !== null ||
        target.closest("a") !== null ||
        target.closest("[role='button']") !== null ||
        window.getComputedStyle(target).cursor === "pointer";

      stateRef.current = {
        x: e.clientX,
        y: e.clientY,
        isHovering,
        isVisible: true,
      };
    };

    const handleMouseLeave = () => {
      stateRef.current.isVisible = false;
    };

    const handleMouseEnter = () => {
      stateRef.current.isVisible = true;
    };

    const animate = () => {
      const state = stateRef.current;

      // Dot follows instantly
      dot.style.transform = `translate(${state.x}px, ${state.y}px) translate(-50%, -50%)`;
      dot.style.opacity = state.isVisible ? (state.isHovering ? "0.6" : "0.9") : "0";

      // Ring follows with lerp (smooth delay)
      ringPosRef.current.x += (state.x - ringPosRef.current.x) * 0.12;
      ringPosRef.current.y += (state.y - ringPosRef.current.y) * 0.12;

      const ringScale = state.isHovering ? 1.6 : 1;
      const currentScale = parseFloat(ring.dataset.scale || "1");
      const newScale = currentScale + (ringScale - currentScale) * 0.1;
      ring.dataset.scale = String(newScale);

      ring.style.transform = `translate(${ringPosRef.current.x}px, ${ringPosRef.current.y}px) translate(-50%, -50%) scale(${newScale})`;
      ring.style.opacity = state.isVisible ? (state.isHovering ? "0.35" : "0.2") : "0";

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const dotColor = isLight
    ? "rgba(30, 30, 34, 0.5)"
    : "rgba(232, 228, 222, 0.7)";
  const ringColor = isLight
    ? "rgba(30, 30, 34, 0.12)"
    : "rgba(232, 228, 222, 0.15)";
  const ringBorderColor = isLight
    ? "rgba(30, 30, 34, 0.25)"
    : "rgba(232, 228, 222, 0.3)";

  return (
    <>
      {/* Central dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: dotColor,
          pointerEvents: "none",
          zIndex: 9999,
          transition: "opacity 0.2s ease, width 0.2s ease, height 0.2s ease",
          willChange: "transform, opacity",
        }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        data-scale="1"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          backgroundColor: ringColor,
          border: `1px solid ${ringBorderColor}`,
          pointerEvents: "none",
          zIndex: 9998,
          transition: "opacity 0.3s ease",
          willChange: "transform, opacity",
          backdropFilter: "blur(1px)",
        }}
      />
    </>
  );
}
