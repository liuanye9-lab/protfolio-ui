"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mail, ChevronRight, Layout, Workflow, MonitorSmartphone, Sun, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import StaticFrostedBackground from '@/components/StaticFrostedBackground';
import CursorAura from '@/components/CursorAura';
import InteractiveIntroHero from '@/components/InteractiveIntroHero';
import ProfileHero from '@/components/ProfileHero';
import ProjectModal, { ImageWithFallback } from '@/components/ProjectModal';
import { HOME_PROJECTS, type Project } from '@/lib/projects';

// ── Configuration ──
const BEZIER = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

const PROJECTS = HOME_PROJECTS;

// ── Theme Hook (localStorage + system preference + toggle) ──
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

  const toggle = useCallback(() => setIsLight(prev => !prev), []);

  return { isLight, toggle, mounted };
}

// ── Intersection Observer Hook ──
function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isIntersecting] as const;
}

const ProgressBar = () => {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (progressRef.current) {
            const totalScroll = window.scrollY;
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const percentage = (totalScroll / windowHeight) * 100;
            progressRef.current.style.transform = `scaleX(${percentage / 100})`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-50 origin-left" style={{ background: 'var(--progress-track)' }}>
      <div
        ref={progressRef}
        className="h-full origin-left scale-x-0"
        style={{ background: 'var(--progress-fill)', transition: 'transform 0.1s ease-out' }}
      />
    </div>
  );
};

const Reveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const [ref, isVisible] = useIntersectionObserver();
  return (
    <div ref={ref} className={`transition-all duration-1000 ${className}`}
      style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)', transitionTimingFunction: BEZIER, transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

// ── 3D Tilt Card ──
const TiltCard = ({ children, className = "", intensity = 6 }: { children: React.ReactNode, className?: string, intensity?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * intensity, y: -x * intensity });
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => { setIsHovering(false); setTilt({ x: 0, y: 0 }); }}
      style={{
        transform: isHovering
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.01, 1.01, 1.01)`
          : 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  );
};

const SpotlightCard = ({ children, className = "", onClick, videoSrc, poster }: { children: React.ReactNode, className?: string, onClick?: () => void, videoSrc?: string | null, poster?: string }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [videoError, setVideoError] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x, y });
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotation({ x: ((y - centerY) / centerY) * -3, y: ((x - centerX) / centerX) * 3 });
  };

  const playVideo = () => { videoRef.current?.play().catch(() => {}); };
  const pauseVideo = () => { if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; } };

  const handleMouseEnter = () => { setOpacity(1); playVideo(); };
  const handleMouseLeave = () => { setOpacity(0); setRotation({ x: 0, y: 0 }); pauseVideo(); };
  const handleTouchStart = () => { setOpacity(1); playVideo(); };
  const handleTouchEnd = () => { setOpacity(0); setRotation({ x: 0, y: 0 }); pauseVideo(); };

  return (
    <div ref={divRef} role="button" tabIndex={0} aria-label="View Project Case Study"
      onKeyDown={(e) => { if (e.key === 'Enter' && onClick) onClick(); }}
      onMouseMove={handleMouseMove} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onClick={onClick}
      className={`relative overflow-hidden rounded-3xl border project-card backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-offset-4 ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateY(${opacity > 0 ? '-4px' : '0'})`,
        transitionTimingFunction: BEZIER,
      }}>
      <div className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-10"
        style={{ opacity, background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(var(--accent-rgb),.08), transparent 40%)` }} />
      {videoSrc && !videoError && (
        <video ref={videoRef} src={videoSrc} loop muted playsInline preload="metadata" poster={poster} onError={() => setVideoError(true)}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-700 z-[1] ${opacity > 0 ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`} />
      )}
      <div className="relative w-full h-full flex flex-col md:flex-row pointer-events-none">
        {children}
      </div>
    </div>
  );
};

const NavBar = ({ onLogoClick, isLight, onToggleTheme }: { onLogoClick: () => void; isLight: boolean; onToggleTheme: () => void }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };

  return (
    <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ${scrolled ? 'w-[92%] md:w-[440px]' : 'w-[92%] md:w-[520px]'}`}>
      <div className="site-nav-pill flex items-center justify-between px-5 py-3 rounded-full transition-colors duration-1000"
        style={{ color: 'var(--text-secondary)' }}>
        <button className="font-medium tracking-tight cursor-pointer relative focus:outline-none"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); onLogoClick(); }}>
          Lay
          <span className="absolute -top-1 -right-2.5 w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--accent-color)', boxShadow: '0 0 8px var(--accent-color)' }} />
        </button>
        <div className="flex items-center gap-5 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <button onClick={() => scrollTo('works')} className="hover:transition-colors focus:outline-none" style={{ ['--tw-text-opacity' as string]: 1, color: 'var(--text-secondary)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>Works</button>
          <button onClick={() => scrollTo('process')} className="hover:transition-colors focus:outline-none"
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>Process</button>
          <button onClick={() => scrollTo('about')} className="hover:transition-colors focus:outline-none"
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>About</button>
          {/* Theme Toggle */}
          <button
            type="button"
            aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
            className="ios-icon theme-toggle ml-1"
            onClick={onToggleTheme}
          >
            {isLight ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

// ── Main Page ──

export default function PortfolioPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const { isLight, toggle } = useTheme();
  const router = useRouter();

  const handleLogoClick = useCallback(() => {
    setClickCount(c => c + 1);
    if (clickCount >= 4) {
      setClickCount(0);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([15, 30, 15]);
      }
    }
  }, [clickCount]);

  const handleProjectClick = useCallback((project: Project) => {
    if (project.isMoreCard && project.href) {
      router.push(project.href);
      return;
    }
    setSelectedProject(project);
  }, [router]);

  return (
    <div className="min-h-screen transition-colors duration-1000" style={{ color: 'var(--text-primary)' }}>
      <StaticFrostedBackground />
      <CursorAura />
      <ProgressBar />
      <NavBar onLogoClick={handleLogoClick} isLight={isLight} onToggleTheme={toggle} />

      <main className="relative z-10">
        {/* ═══════════════════════════════════════════════════════════
            INTERACTIVE INTRO HERO — 鼠标 reveal 中英切换首屏
            ═══════════════════════════════════════════════════════════ */}
        <InteractiveIntroHero />

        {/* ═══════════════════════════════════════════════════════════
            PROFILE HERO — 个人肖像第二屏
            ═══════════════════════════════════════════════════════════ */}
        <ProfileHero />

        {/* ═══════════════════════════════════════════════════════════
            CAPABILITIES
            ═══════════════════════════════════════════════════════════ */}
        <section className="py-24 md:py-32 relative backdrop-blur-xl" style={{ background: 'rgba(var(--bg-secondary-rgb), 0.78)', borderTop: '1px solid var(--border-subtle)' }}>
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <Reveal>
              <h2 className="font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}>
                From concept to prototype.
              </h2>
              <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>从概念到可交互原型。</p>
              <div className="max-w-3xl text-sm md:text-base leading-relaxed mb-16 space-y-4" style={{ color: 'var(--text-secondary)' }}>
                <p>我关注的不是&ldquo;AI 能不能生成结果&rdquo;，而是一个复杂 AI 项目如何被用户理解、操作、判断和记住。</p>
                <p>设计训练让我对视觉秩序、叙事路径和体验节奏更敏感；AI 与前端实践让我理解产品背后的流程、模型能力和工程边界。</p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Layout, title: 'Interface Design', desc: '把复杂任务变成清晰界面。' },
                { icon: Workflow, title: 'AI Workflow', desc: '把模糊想法变成可执行流程。' },
                { icon: MonitorSmartphone, title: 'AIGC Visual System', desc: '把 AI 生成结果变成统一视觉语言。' },
              ].map((item, idx) => (
                <Reveal key={item.title} delay={(idx + 1) * 100}>
                  <TiltCard intensity={5}>
                    <div className="p-8 rounded-3xl border backdrop-blur-xl transition-colors group h-full"
                      style={{ background: 'var(--bg-card-10)', borderColor: 'var(--border-subtle)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-card-10)')}>
                    <span className="ios-icon mb-5">
                      <item.icon />
                    </span>
                      <h3 className="text-xl font-medium mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{item.title}</h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            WORKS
            ═══════════════════════════════════════════════════════════ */}
        <section id="works" className="works-section py-24 md:py-32 relative">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top, rgba(var(--accent-rgb),0.03), transparent 50%)', zIndex: -1 }} />
          <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
            <Reveal>
              <h2 className="font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 'clamp(2rem, 4.5vw, 3.75rem)' }}>
                Selected Works
              </h2>
              <p className="text-lg md:text-xl mb-2" style={{ color: 'var(--text-secondary)' }}>Four projects that define my current direction.</p>
              <p className="text-sm mb-16" style={{ color: 'var(--text-muted)' }}>四个项目，构成我目前的 AI 设计方向。</p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 auto-rows-[400px]">
              {/* Project 01 — Large */}
              <Reveal className="md:col-span-2 h-full">
                <SpotlightCard videoSrc={PROJECTS[0].video} poster={PROJECTS[0].cover} className="h-full group" onClick={() => handleProjectClick(PROJECTS[0])}>
                  <div className="p-8 md:p-12 w-full md:w-1/2 flex flex-col justify-center z-20 transition-transform duration-500 group-hover:translate-x-2">
                    <h3 className="text-3xl font-bold mb-2 tracking-tight transition-colors" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary-90)' }}>{PROJECTS[0].title}</h3>
                    <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{PROJECTS[0].subtitle}</p>
                    <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-primary-70)' }}>{PROJECTS[0].summary}</p>
                    <div className="mt-auto flex items-center text-xs font-mono transition-colors" style={{ color: 'var(--text-tertiary)' }}>
                      View Case Study <ChevronRight size={14} className="ml-1" />
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 h-full absolute right-0 top-0 overflow-hidden border-l" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}>
                    <ImageWithFallback src={PROJECTS[0].cover} alt={PROJECTS[0].title}
                      className={`absolute inset-0 w-full h-full object-cover object-right transition-all duration-1000 ease-out ${PROJECTS[0].video ? 'opacity-70 group-hover:opacity-0' : 'group-hover:scale-105 opacity-70'}`} />
                    <div className="absolute inset-0 z-[2] pointer-events-none"
                      style={{ background: 'linear-gradient(to top, var(--bg-tertiary), transparent), linear-gradient(to right, var(--bg-tertiary), transparent 80%)' }} />
                  </div>
                </SpotlightCard>
              </Reveal>

              {/* Project 02 */}
              <Reveal className="h-full">
                <SpotlightCard videoSrc={PROJECTS[1].video} poster={PROJECTS[1].cover} className="h-full flex-col group" onClick={() => handleProjectClick(PROJECTS[1])}>
                  <div className="h-1/2 w-full absolute top-0 left-0 overflow-hidden border-b" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}>
                    <ImageWithFallback src={PROJECTS[1].cover} alt={PROJECTS[1].title}
                      className={`w-full h-full object-cover object-center transition-all duration-1000 ease-out ${PROJECTS[1].video ? 'opacity-80 group-hover:opacity-0' : 'group-hover:scale-105 opacity-80'}`} />
                    <div className="absolute inset-0 z-[2] pointer-events-none" style={{ background: 'linear-gradient(to top, var(--bg-tertiary), transparent)', opacity: 0.9 }} />
                  </div>
                  <div className="p-8 flex flex-col w-full h-full justify-end z-20">
                    <h3 className="text-2xl font-bold mb-2 tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary-90)' }}>{PROJECTS[1].title}</h3>
                    <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>{PROJECTS[1].subtitle}</p>
                    <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--text-primary-70)' }}>{PROJECTS[1].summary}</p>
                    <div className="mt-4 flex items-center text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
                      View Case Study <ChevronRight size={14} className="ml-1" />
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>

              {/* Project 03 */}
              <Reveal className="h-full">
                <SpotlightCard videoSrc={PROJECTS[2].video} poster={PROJECTS[2].cover} className="h-full flex-col group" onClick={() => handleProjectClick(PROJECTS[2])}>
                  <div className="h-1/2 w-full absolute top-0 left-0 overflow-hidden border-b" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}>
                    <ImageWithFallback src={PROJECTS[2].cover} alt={PROJECTS[2].title}
                      className={`w-full h-full object-cover object-center transition-all duration-1000 ${PROJECTS[2].video ? 'opacity-80 group-hover:opacity-0' : 'group-hover:scale-105 opacity-80'}`} />
                    <div className="absolute inset-0 z-[2] pointer-events-none" style={{ background: 'linear-gradient(to top, var(--bg-tertiary), transparent)', opacity: 0.9 }} />
                  </div>
                  <div className="p-8 flex flex-col w-full h-full justify-end z-20">
                    <h3 className="text-2xl font-bold mb-2 tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary-90)' }}>{PROJECTS[2].title}</h3>
                    <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>{PROJECTS[2].subtitle}</p>
                    <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--text-primary-70)' }}>{PROJECTS[2].summary}</p>
                    <div className="mt-4 flex items-center text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
                      View Case Study <ChevronRight size={14} className="ml-1" />
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>

              {/* Project 04 */}
              <Reveal className="md:col-span-2 h-[300px]">
                <SpotlightCard videoSrc={PROJECTS[3].video} poster={PROJECTS[3].cover} className="h-full flex-row group" onClick={() => handleProjectClick(PROJECTS[3])}>
                  <div className="w-full md:w-1/3 h-full absolute left-0 top-0 border-r overflow-hidden" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}>
                    <ImageWithFallback src={PROJECTS[3].cover} alt={PROJECTS[3].title}
                      className={`absolute inset-0 w-full h-full object-cover object-[75%_center] transition-all duration-1000 ease-out ${PROJECTS[3].video ? 'opacity-80 group-hover:opacity-0' : 'group-hover:scale-105 opacity-80'}`} />
                    <div className="absolute inset-0 z-[2] pointer-events-none md:hidden" style={{ background: 'linear-gradient(to top, var(--bg-tertiary) 80%, transparent)' }} />
                    <div className="absolute inset-0 z-[2] pointer-events-none hidden md:block" style={{ background: 'linear-gradient(to right, transparent, var(--bg-tertiary) 60%)' }} />
                  </div>
                  <div className="p-8 md:p-12 w-full md:w-2/3 md:ml-auto h-full flex flex-col justify-center z-20 transition-transform duration-500 group-hover:-translate-x-2">
                    <h3 className="text-2xl font-bold mb-2 tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary-90)' }}>{PROJECTS[3].title}</h3>
                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{PROJECTS[3].subtitle}</p>
                    <p className="text-sm leading-relaxed max-w-lg" style={{ color: 'var(--text-primary-70)' }}>{PROJECTS[3].summary}</p>
                    <div className="mt-6 flex items-center text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
                      More Projects <ChevronRight size={14} className="ml-1" />
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            PROCESS
            ═══════════════════════════════════════════════════════════ */}
        <section id="process" className="py-24 md:py-32 backdrop-blur-sm" style={{ background: 'rgba(var(--bg-secondary-rgb), 0.88)' }}>
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <Reveal>
              <h2 className="font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}>
                My Process
              </h2>
              <p className="text-lg mb-2" style={{ color: 'var(--text-secondary)' }}>From concept to interactive prototype.</p>
              <p className="text-sm mb-16" style={{ color: 'var(--text-muted)' }}>从概念到可交互原型。</p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] pointer-events-none" style={{ background: 'linear-gradient(to right, transparent, var(--border-medium), transparent)', transform: 'translateY(-50%)' }} />
              {[
                { title: 'Decode', desc: '理解真实问题' },
                { title: 'Structure', desc: '拆解流程与层级' },
                { title: 'Visualize', desc: '转化为界面语言' },
                { title: 'Prototype', desc: '完成前端原型' },
              ].map((step, idx) => (
                <Reveal key={step.title} delay={idx * 100} className="relative z-10">
                  <TiltCard intensity={4}>
                    <div className="p-8 border rounded-3xl h-full flex flex-col group transition-colors duration-500 relative overflow-hidden backdrop-blur-xl"
                      style={{ background: 'var(--bg-card-8)', borderColor: 'var(--border-subtle)' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-medium)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}>
                      <div className="absolute top-0 right-0 p-4 text-[100px] font-bold leading-none pointer-events-none" style={{ color: 'var(--text-primary)', opacity: 0.02 }}>{idx + 1}</div>
                      <span className="text-xs font-mono tracking-widest mb-6" style={{ color: 'var(--text-muted)' }}>STEP 0{idx + 1}</span>
                      <h3 className="text-2xl font-bold mb-4 tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{step.title}</h3>
                      <p className="text-sm leading-relaxed mt-auto transition-colors" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            ABOUT
            ═══════════════════════════════════════════════════════════ */}
        <section id="about" className="py-24 md:py-32 relative backdrop-blur-xl" style={{ background: 'rgba(var(--bg-secondary-rgb), 0.78)', borderTop: '1px solid var(--border-subtle)' }}>
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16">
            <Reveal>
              <h2 className="font-bold tracking-tight mb-12" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}>
                About Lay
              </h2>
              <div className="space-y-6 text-base md:text-lg leading-relaxed">
                <p className="font-medium" style={{ color: 'var(--text-primary-70)' }}>
                  东北农业大学｜双一流｜211<br />
                  设计学背景｜辅修计算机科学
                </p>
                <p style={{ color: 'var(--text-secondary)' }}>
                  设计让我对视觉秩序、叙事路径和体验节奏更敏感；AI 与前端实践让我理解产品背后的流程、模型能力和工程边界。
                </p>
                <p className="font-medium" style={{ color: 'var(--text-primary-90)' }}>
                  我擅长把一个 AI 项目从概念、逻辑、视觉到前端原型完整设计出来。
                </p>
              </div>
            </Reveal>

            <Reveal delay={200} className="flex flex-col justify-center">
              <h3 className="text-xs font-mono uppercase tracking-widest mb-6" style={{ color: 'var(--text-muted)' }}>Capabilities</h3>
              <div className="flex flex-wrap gap-3">
                {['Interface Design', 'AI Agent UI', 'AIGC Workflow', 'Frontend Prototyping', 'Visual Storytelling', 'Prompt System'].map(skill => (
                  <span key={skill} className="px-4 py-2 rounded-full border text-sm cursor-default transition-colors backdrop-blur-md"
                    style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-card-8)', color: 'var(--text-primary-80)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-card-8)')}>
                    {skill}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            CONTACT — 视觉冲击尾页
            ═══════════════════════════════════════════════════════════ */}
        <section id="contact" className="py-24 md:py-32 relative overflow-hidden backdrop-blur-xl" style={{ background: 'rgba(var(--bg-secondary-rgb), 0.78)', borderTop: '1px solid var(--border-subtle)' }}>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h1 className="font-bold tracking-tighter" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 'clamp(12vw, 20vw, 22vw)', opacity: 0.025 }}>
              LAY
            </h1>
          </div>

          <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
            <Reveal>
              {/* 标题区 — 占满 50% 视觉高度，形成冲击 */}
              <div className="min-h-[50vh] flex flex-col items-center justify-center text-center mb-16">
                <h2 className="font-bold tracking-tight leading-[1.05] mb-6"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 'clamp(2.5rem, 8vw, 7rem)' }}>
                  Keep exploring,<br className="hidden md:block" /> keep improving
                </h2>
                <p className="font-medium tracking-wide" style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1.125rem, 2.5vw, 1.75rem)' }}>
                  保持探索，持续进步
                </p>
              </div>

              {/* 联系方式 */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
                <a href="tel:136-5731-0228"
                  className="flex items-center gap-3 px-8 py-4 rounded-full font-medium hover:transition-all duration-300 backdrop-blur-md focus:outline-none focus:ring-2"
                  style={{ border: '1px solid var(--btn-secondary-border)', color: 'var(--btn-secondary-text)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>phone</span>
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>136-5731-0228</span>
                </a>
                <a href="mailto:3130577758@qq.com"
                  className="flex items-center gap-3 px-8 py-4 rounded-full font-medium hover:opacity-90 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2"
                  style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)' }}>
                  <Mail size={18} />
                  <span>3130577758@qq.com</span>
                </a>
              </div>
            </Reveal>
          </div>

          <div className="mt-32 pt-8 text-center text-xs font-mono" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)' }}>
            &copy; {new Date().getFullYear()} Lay Liu. Designed &amp; Built with React + Tailwind.
          </div>
        </section>
      </main>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
