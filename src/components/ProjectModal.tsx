"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronRight, X } from "lucide-react";
import type { Project } from "@/lib/projects";

type ImageWithFallbackProps = {
  src: string;
  alt: string;
  className?: string;
};

export function ImageWithFallback({ src, alt, className = "" }: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`project-image-fallback ${className}`}>
        <span>{alt}</span>
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
}

const ImageGallery = ({ images }: { images?: string[] }) => {
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  if (!images || images.length === 0) return null;

  const labels = ["Cover", "Workflow", "UI Detail", "Result"];

  const openLightbox = (img: string, idx: number) => {
    setLightboxImg(img);
    setLightboxIdx(idx);
  };

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = (lightboxIdx + 1) % images.length;
    setLightboxIdx(next);
    setLightboxImg(images[next]);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prev = (lightboxIdx - 1 + images.length) % images.length;
    setLightboxIdx(prev);
    setLightboxImg(images[prev]);
  };

  return (
    <div className="mb-16">
      <h3 className="text-2xl font-medium tracking-tight mb-8" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>Project Gallery</h3>
      <div className="flex flex-col gap-6">
        {images.slice(0, 4).map((img, i) => (
          <button
            key={img}
            aria-label={`Enlarge ${labels[i] || "project image"}`}
            className="relative group focus:outline-none focus:ring-2 rounded-2xl overflow-hidden w-full"
            onClick={() => openLightbox(img, i)}
          >
            <div className="absolute left-4 top-4 z-20 rounded-full border px-3 py-1 text-xs font-mono" style={{ background: "var(--bg-card-10)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}>
              {labels[i] || `Image ${i + 1}`}
            </div>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center backdrop-blur-sm duration-500"
              style={{ background: "var(--bg-card-10)" }}
            >
              <span
                className="text-sm font-mono tracking-widest px-5 py-2.5 rounded-full border"
                style={{ background: "var(--bg-card-8)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
              >
                View Full Size
              </span>
            </div>
            <ImageWithFallback
              src={img}
              alt={`${labels[i] || "Project Image"} ${i + 1}`}
              className="w-full h-[280px] md:h-[520px] object-cover rounded-2xl border shadow-2xl transition-transform duration-700 group-hover:scale-[1.01]"
            />
          </button>
        ))}
      </div>

      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ${lightboxImg ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ background: "var(--bg-overlay)", backdropFilter: "blur(24px)" }}
        onClick={() => setLightboxImg(null)}
      >
        <div className={`transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${lightboxImg ? "scale-100 translate-y-0" : "scale-95 translate-y-8"}`}>
          {lightboxImg && <ImageWithFallback src={lightboxImg} className="max-w-[95vw] max-h-[92vh] object-contain rounded-xl shadow-2xl" alt="Lightbox" />}
        </div>

        {lightboxImg && (
          <>
            <button
              onClick={prevImg}
              aria-label="Previous image"
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-md border hover:transition-colors focus:outline-none"
              style={{ background: "var(--bg-card-10)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
            >
              <ChevronRight size={24} className="rotate-180" />
            </button>
            <button
              onClick={nextImg}
              aria-label="Next image"
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-md border hover:transition-colors focus:outline-none"
              style={{ background: "var(--bg-card-10)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
            >
              <ChevronRight size={24} />
            </button>
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-mono tracking-wider"
              style={{ background: "var(--bg-card-10)", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)" }}
            >
              {lightboxIdx + 1} / {images.length}
            </div>
          </>
        )}

        <button
          aria-label="Close lightbox"
          onClick={() => setLightboxImg(null)}
          className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 flex items-center justify-center rounded-full hover:transition-colors border backdrop-blur-md focus:outline-none focus:ring-2"
          style={{ background: "var(--bg-card-10)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
};

export default function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const [isVisible, setIsVisible] = useState(false);
  const [dragY, setDragY] = useState(0);
  const startY = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      document.body.style.overflow = "";
      setIsVisible(false);
      setDragY(0);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scrollRef.current && scrollRef.current.scrollTop > 0) return;
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaY = e.touches[0].clientY - startY.current;
    if (deltaY > 0 && (!scrollRef.current || scrollRef.current.scrollTop <= 0)) {
      setDragY(deltaY * 0.4);
    }
  };

  const handleTouchEnd = () => {
    if (dragY > 100) {
      setIsVisible(false);
      setTimeout(onClose, 300);
    } else {
      setDragY(0);
    }
  };

  if (!project) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-0 md:p-8 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isVisible ? "opacity-100" : "opacity-0"}`}
      style={{ background: "var(--modal-backdrop)", backdropFilter: isVisible ? "blur(24px)" : "blur(0px)" }}
    >
      <div className="absolute inset-0 cursor-pointer hidden md:block" onClick={onClose} />
      <div
        ref={scrollRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full h-full md:h-auto md:max-w-5xl md:max-h-[90vh] overflow-y-auto border md:rounded-3xl shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-16 scale-95 opacity-0"}`}
        style={{ background: "var(--modal-bg)", borderColor: "var(--border-subtle)", transform: dragY > 0 ? `translateY(${dragY}px) scale(${1 - dragY / 3000})` : "", transition: dragY > 0 ? "none" : undefined }}
      >
        <button
          aria-label="Close Project Modal"
          onClick={onClose}
          className="sticky top-6 left-[calc(100%-1rem)] md:left-[calc(100%-3rem)] -translate-x-full md:translate-x-0 z-20 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md hover:transition-colors border focus:outline-none focus:ring-2"
          style={{ background: "var(--bg-card-5)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
        >
          <X size={18} />
        </button>

        <article className="p-6 md:p-16 pt-12 md:pt-16">
          <header className="mb-16">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 leading-tight" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>{project.title}</h2>
            <p className="text-xl mb-2" style={{ color: "var(--text-secondary)" }}>{project.subtitle}</p>
            <p className="text-lg mb-8" style={{ color: "var(--text-primary-60)" }}>{project.cnSubtitle}</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full border text-xs font-mono" style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}>{tag}</span>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8" style={{ borderTop: "1px solid var(--border-subtle)" }}>
              <div>
                <h4 className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>My Role</h4>
                <div className="flex flex-col gap-1">
                  {project.role.map((role) => (
                    <span key={role} className="text-sm" style={{ color: "var(--text-primary-80)" }}>{role}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>TL;DR</h4>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary-80)" }}>{project.summary}</p>
              </div>
            </div>
          </header>

          <figure className="w-full aspect-video rounded-2xl border mb-8 relative overflow-hidden shadow-2xl" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-primary)" }}>
            <ImageWithFallback src={project.cover} alt={`${project.title} Cover`} className="w-full h-full object-cover" />
          </figure>

          <ImageGallery images={project.images} />

          {project.qrCode && (
            <section className="project-qr-card mb-16">
              <div className="project-qr-text">
                <span>Scan to view</span>
                <small>扫码查看项目</small>
              </div>
              <ImageWithFallback src={project.qrCode} alt={`${project.title} QR Code`} />
            </section>
          )}

          <section className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 pt-16" style={{ borderTop: "1px solid var(--border-subtle)" }}>
            <div className="md:col-span-1">
              <h3 className="text-2xl font-medium tracking-tight sticky top-6" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>The Story</h3>
            </div>
            <div className="md:col-span-2 space-y-12">
              <div className="pl-6" style={{ borderLeft: "1px solid var(--border-subtle)" }}>
                <h4 className="text-sm font-mono tracking-widest mb-4 uppercase" style={{ color: "var(--text-primary-40)" }}>Why this project</h4>
                <p className="text-lg leading-relaxed" style={{ color: "var(--text-primary-90)" }}>{project.why}</p>
              </div>
              <div className="pl-6" style={{ borderLeft: "1px solid var(--border-subtle)" }}>
                <h4 className="text-sm font-mono tracking-widest mb-4 uppercase" style={{ color: "var(--text-primary-40)" }}>What I designed</h4>
                <p className="text-lg leading-relaxed" style={{ color: "var(--text-primary-90)" }}>{project.what}</p>
              </div>
            </div>
          </section>

          <section className="p-8 md:p-16 rounded-3xl border text-center relative overflow-hidden" style={{ background: "linear-gradient(to bottom right, var(--bg-card-5), transparent)", borderColor: "var(--border-subtle)" }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at center, rgba(var(--accent-rgb),0.05) 0%, transparent 70%)" }} />
            <h3 className="text-sm uppercase tracking-widest mb-8 font-mono" style={{ color: "var(--text-muted)" }}>Result</h3>
            <p className="text-xl md:text-2xl leading-relaxed font-serif italic max-w-4xl mx-auto relative z-10" style={{ color: "var(--text-primary-90)" }}>
              &ldquo;{project.result}&rdquo;
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
