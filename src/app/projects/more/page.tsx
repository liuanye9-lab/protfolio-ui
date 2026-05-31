"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import CursorAura from "@/components/CursorAura";
import ProjectModal, { ImageWithFallback } from "@/components/ProjectModal";
import StaticFrostedBackground from "@/components/StaticFrostedBackground";
import { MORE_PROJECTS, type Project } from "@/lib/projects";

function useTheme() {
  const [isLight, setIsLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    let nextIsLight = false;
    if (saved === "light") nextIsLight = true;
    else if (saved === "dark") nextIsLight = false;
    else nextIsLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    setIsLight(nextIsLight);
    document.documentElement.setAttribute("data-theme", nextIsLight ? "light" : "dark");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", isLight ? "light" : "dark");
    localStorage.setItem("theme", isLight ? "light" : "dark");
  }, [isLight, mounted]);

  const toggle = useCallback(() => setIsLight((prev) => !prev), []);

  return { isLight, toggle };
}

const MoreProjectCard = ({ project, onClick }: { project: Project; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="project-card more-project-card group text-left overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 focus:outline-none focus:ring-2"
  >
    <div className="relative aspect-[4/3] overflow-hidden border-b" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-primary)" }}>
      <ImageWithFallback
        src={project.cover}
        alt={project.title}
        className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, var(--bg-tertiary), transparent 60%)" }} />
      <span className="absolute left-6 top-6 rounded-full border px-3 py-1 text-xs font-mono" style={{ color: "var(--text-secondary)", borderColor: "var(--border-subtle)", background: "var(--bg-card-10)" }}>
        {String(project.index).padStart(2, "0")}
      </span>
    </div>
    <div className="p-7 md:p-8">
      <h2 className="mb-2 text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>{project.title}</h2>
      <p className="mb-2 text-sm" style={{ color: "var(--text-secondary)" }}>{project.subtitle}</p>
      <p className="mb-6 text-sm leading-relaxed" style={{ color: "var(--text-primary-70)" }}>{project.summary}</p>
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="rounded-full border px-3 py-1 text-xs font-mono" style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  </button>
);

export default function MoreProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { isLight, toggle } = useTheme();

  return (
    <div className="min-h-screen transition-colors duration-1000" style={{ color: "var(--text-primary)" }}>
      <StaticFrostedBackground />
      <CursorAura />

      <nav className="fixed top-6 left-1/2 z-40 w-[92%] max-w-3xl -translate-x-1/2">
        <div className="site-nav-pill flex items-center justify-between rounded-full px-5 py-3">
          <Link href="/#works" className="flex items-center gap-2 text-sm font-medium">
            <ArrowLeft size={16} />
            Back to Works
          </Link>
          <button
            type="button"
            aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
            className="ios-icon theme-toggle"
            onClick={toggle}
          >
            {isLight ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </nav>

      <main className="relative z-10 px-6 pb-24 pt-36 md:px-12 md:pt-44">
        <section className="mx-auto max-w-7xl">
          <header className="mb-14">
            <p className="mb-5 text-sm font-mono uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>返回作品</p>
            <h1 className="mb-4 font-bold tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>
              更多项目
            </h1>
            <p className="max-w-2xl text-lg md:text-xl" style={{ color: "var(--text-secondary)" }}>
              More experiments around Vibe UI and prompt translation.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {MORE_PROJECTS.map((project) => (
              <MoreProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
            ))}
          </div>
        </section>
      </main>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
