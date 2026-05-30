"use client";

import React, { useEffect, useRef } from "react";

export default function InteractiveIntroHero() {
  const rootRef = useRef<HTMLElement>(null);
  const cursorRef = useRef({ x: 0, y: 0, tx: 0, ty: 0, active: false });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      cursorRef.current.tx = event.clientX - rect.left;
      cursorRef.current.ty = event.clientY - rect.top;
      cursorRef.current.active = true;
    };

    const handlePointerLeave = () => {
      cursorRef.current.active = false;
    };

    // rAF loop: smooth cursor following + CSS variable injection
    const animate = () => {
      cursorRef.current.x += (cursorRef.current.tx - cursorRef.current.x) * 0.16;
      cursorRef.current.y += (cursorRef.current.ty - cursorRef.current.y) * 0.16;

      root.style.setProperty("--reveal-x", `${cursorRef.current.x}px`);
      root.style.setProperty("--reveal-y", `${cursorRef.current.y}px`);
      root.style.setProperty("--reveal-opacity", cursorRef.current.active ? "1" : "0");

      rafRef.current = requestAnimationFrame(animate);
    };

    root.addEventListener("pointermove", handlePointerMove, { passive: true });
    root.addEventListener("pointerleave", handlePointerLeave);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerleave", handlePointerLeave);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="interactive-intro-hero"
      style={{ touchAction: "none" }}
    >
      {/* ═══════ LAY 品牌纹理背景 ═══════ */}
      <div className="intro-pattern" aria-hidden>
        {Array.from({ length: 9 }).map((_, row) => (
          <div key={row} className="intro-pattern-row"
            style={{ ["--row-offset" as string]: row % 2 === 1 ? "-8vw" : "0" } as React.CSSProperties}>
            LAY&nbsp;&nbsp;LAY&nbsp;&nbsp;LAY&nbsp;&nbsp;LAY&nbsp;&nbsp;LAY&nbsp;&nbsp;LAY&nbsp;&nbsp;LAY&nbsp;&nbsp;LAY
          </div>
        ))}
      </div>

      {/* ═══════ 顶部眉标 ═══════ */}
      <p className="intro-eyebrow">AI Agent UI Designer</p>

      {/* ═══════ 核心标题区域 — 双层文字 + 光标透镜 ═══════ */}
      <div className="intro-title-wrap" aria-label="你好，我是 Lay — Hello, I'm Lay">
        {/* 基础层：中文 */}
        <h1 className="intro-title intro-title-base" aria-hidden>
          你好，我是 Lay
        </h1>

        {/* 揭示层：英文（mask 限制在圆形区域） */}
        <h1 className="intro-title intro-title-reveal" aria-hidden>
          Hello, I&rsquo;m Lay
        </h1>

        {/* 光标透镜 */}
        <div className="intro-reveal-lens" aria-hidden />
      </div>

      {/* ═══════ 副标题 ═══════ */}
      <p className="intro-subtitle">Designing interfaces for AI Agent products.</p>

      {/* ═══════ 移动端英文回退 ═══════ */}
      <p className="intro-mobile-english">Hello, I&rsquo;m Lay</p>

      {/* ═══════ 滚动提示 ═══════ */}
      <div className="intro-scroll-cue" aria-hidden onClick={() => {
        document.getElementById("works")?.scrollIntoView({ behavior: "smooth" });
      }}>
        <span>Scroll to explore</span>
        <span className="intro-scroll-line" />
      </div>
    </section>
  );
}
