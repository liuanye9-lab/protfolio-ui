"use client";

import React, { useEffect, useRef } from "react";

interface CursorState {
  x: number;
  y: number;
  isHovering: boolean;
  isVisible: boolean;
}

export default function CursorAura() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<CursorState>({ x: -100, y: -100, isHovering: false, isVisible: false });
  const ringPosRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
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

      stateRef.current = { x: e.clientX, y: e.clientY, isHovering, isVisible: true };
    };

    const handleMouseLeave = () => { stateRef.current.isVisible = false; };
    const handleMouseEnter = () => { stateRef.current.isVisible = true; };

    const animate = () => {
      const state = stateRef.current;
      dot.style.transform = `translate(${state.x}px, ${state.y}px) translate(-50%, -50%)`;
      dot.style.opacity = state.isVisible ? (state.isHovering ? "0.45" : "0.65") : "0";

      ringPosRef.current.x += (state.x - ringPosRef.current.x) * 0.12;
      ringPosRef.current.y += (state.y - ringPosRef.current.y) * 0.12;

      const ringScale = state.isHovering ? 1.6 : 1;
      const currentScale = parseFloat(ring.dataset.scale || "1");
      const newScale = currentScale + (ringScale - currentScale) * 0.1;
      ring.dataset.scale = String(newScale);
      ring.style.transform = `translate(${ringPosRef.current.x}px, ${ringPosRef.current.y}px) translate(-50%, -50%) scale(${newScale})`;
      ring.style.opacity = state.isVisible ? (state.isHovering ? "0.24" : "0.14") : "0";

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

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: "fixed", top: 0, left: 0,
          width: "6px", height: "6px", borderRadius: "50%",
          backgroundColor: "var(--icon-color, rgba(232,228,222,0.7))",
          pointerEvents: "none", zIndex: 9999,
          transition: "opacity 0.2s ease", willChange: "transform, opacity",
        }}
      />
      <div
        ref={ringRef}
        data-scale="1"
        style={{
          position: "fixed", top: 0, left: 0,
          width: "36px", height: "36px", borderRadius: "50%",
          backgroundColor: "var(--glass-bg, rgba(232,228,222,0.12))",
          border: "1px solid var(--border-subtle, rgba(232,228,222,0.3))",
          pointerEvents: "none", zIndex: 9998,
          transition: "opacity 0.3s ease", willChange: "transform, opacity",
          backdropFilter: "blur(1px)",
        }}
      />
    </>
  );
}
