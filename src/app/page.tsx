"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, Mail, X, ChevronRight, Layout, Workflow, MonitorSmartphone } from 'lucide-react';
import StaticFrostedBackground from '@/components/StaticFrostedBackground';
import CursorAura from '@/components/CursorAura';
import InteractiveIntroHero from '@/components/InteractiveIntroHero';
import ProfileHero from '@/components/ProfileHero';

// ── Custom Brand Icons ──
const GithubIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

const TwitterIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
    <path d="M4 20l6.768 -6.768m2.46 -2.46L20 4"/>
  </svg>
);

// ── Configuration ──
const BEZIER = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

const PROJECTS = [
  {
    id: 'stable-agent',
    title: 'StableAgent OS',
    enSubtitle: 'A visual operating system concept for AI agent workflows.',
    cnSubtitle: '面向 AI Agent 工作流的视觉操作系统概念。',
    summary: '把 Agent 的任务规划、执行状态、人工检查和结果复盘，组织成一个更清晰的界面系统。',
    description: 'StableAgent OS 是我对未来 AI Agent 产品界面的探索。它不是单纯的聊天窗口，而是一种更接近"工作台"的界面概念：用户可以看见任务如何被拆解、Agent 如何执行、结果如何被评估，以及人在什么节点介入。',
    roles: ['Interface Designer', 'Product Storyteller', 'Frontend Prototyper'],
    tags: ['Agent UI', 'Workflow Visualization', 'Human-in-the-loop'],
    size: 'large',
    visualType: 'dashboard',
    story: {
      why: '当前大多数 AI Agent 都局限于对话流，缺乏对复杂任务的全局感知和执行干预能力。',
      problem: '如何让"不可见"的 AI 推理过程变成"可见"、"可控"的用户操作界面。',
      role: '主导概念设计、界面交互定义以及前端高保真原型的构建。'
    },
    process: ['Task Breakdown', 'Agent Execution', 'Human Intervention', 'Result Evaluation'],
    designDetail: {
      interaction: '全局节点高亮，支持随时打断与修改 Agent 计划。',
      architecture: '分层工作台：左侧全局大纲，右侧实时执行状态与数据馈送。',
      visual: '黑白极简配色，液态玻璃面板，弱化边框，强调内容层级。'
    },
    reflection: '我理解了 AI 产品的核心不在于拟人化，而在于信任感。用户只有看懂了 AI 在做什么，才会真正信任并把工作交给它。下一步将探索更细颗粒度的节点编辑能力。',
    cover: '/ChatGPT Image 2026年5月29日 01_25_19 (1).png',
    video: '/1.mp4',
    gallery: ['/1-1.png', '/1-2.png', '/1-3.png', '/1-4.png']
  },
  {
    id: 'vibe-copilot',
    title: 'Vibe Copilot',
    enSubtitle: 'A product framing tool for AI coding.',
    cnSubtitle: '面向 AI Coding 的产品构思辅助工具。',
    summary: '把模糊产品想法转化为产品定义、MVP 范围和可执行开发提示词。',
    description: '很多人使用 Codex、Claude Code 或 Cursor 时，真正卡住的不是代码，而是不知道如何把想法说清楚。Vibe Copilot 试图在"想法"和"代码"之间加一层产品构思界面，让用户先完成问题定义、用户场景、功能边界和验收标准，再交给 AI 编程工具执行。',
    roles: ['Product Designer', 'Workflow Designer', 'Frontend Prototyper'],
    tags: ['AI Coding', 'Product Framing', 'MVP Scope'],
    size: 'medium',
    visualType: 'editor',
    story: {
      why: 'AI 编程工具降低了代码门槛，但提高了需求定义的门槛。',
      problem: '解决普通用户"有想法但不知如何向 AI 描述系统要求"的问题。',
      role: '负责整个"想法到提示词"的工作流设计与界面交互落地。'
    },
    process: ['Idea Input', 'Clarification', 'Scope Definition', 'Prompt Export'],
    designDetail: {
      interaction: '渐进式表单展开，引导用户逐步思考，避免面对空白输入框的焦虑。',
      architecture: '从抽象（Idea）到具象（Requirements），再到结构化数据（Prompt）。',
      visual: '类似文档编辑器的纯净体验，强调排版和段落层级。'
    },
    reflection: '好产品不是替用户思考，而是搭建脚手架帮助用户思考。下一步计划引入历史组件库的联动匹配。',
    cover: '/ChatGPT Image 2026年5月29日 01_25_19 (2).png',
    video: '/2.mp4',
    gallery: ['/2-1.png', '/2-2.png', '/2-3.png', '/2-4.png']
  },
  {
    id: 'controlnet-workflow',
    title: 'ControlNet Design Workflow',
    enSubtitle: 'A controllable AIGC pipeline for spatial concept design.',
    cnSubtitle: '面向空间概念设计的可控 AIGC 生成流程。',
    summary: '用 ControlNet、视觉大模型和 Prompt 系统，把空间草图与设计意图转化为稳定的 AI 视觉输出。',
    description: 'AIGC 生图不是只追求"好看"，真正难的是可控、稳定、可复现。这个项目来自我在空间设计和 AIGC 实践中的经验：通过线稿控制、构图约束、风格提示、模型选择和结果筛选，让 AI 生成图更接近真实设计工作流。',
    roles: ['AIGC Workflow Designer', 'Spatial Visual Designer', 'Prompt System Designer'],
    tags: ['ControlNet', 'ComfyUI', 'AIGC Pipeline'],
    size: 'medium',
    visualType: 'gallery',
    story: {
      why: '传统的空间设计渲染耗时极长，而早期的 AI 生成图过于随机，无法用于实际落地讨论。',
      problem: '建立一套高度可控的生成管线，平衡"创意发散"与"结构严谨"。',
      role: '设计管线结构，调试模型权重，建立标准的 Prompt 参数库。'
    },
    process: ['Sketch Input', 'Control Layer Setup', 'Prompt Conditioning', 'Batch Generation & Filter'],
    designDetail: {
      interaction: '构建了多层 ControlNet 权重的可视化调节面板概念。',
      architecture: '分层控制：深度层决定体块，线稿层决定细节，颜色层决定氛围。',
      visual: '高对比度展示从线稿到照片级渲染的演变过程。'
    },
    reflection: 'AI 并不是终点，它只是工作流中的一个强力滤镜。下一步计划将工作流打包为更轻量的设计师 API 工具。',
    cover: '/ChatGPT Image 2026年5月29日 01_25_19 (3).png',
    video: '/3.mp4',
    gallery: ['/3-1.png', '/3-2.png', '/3-3.png', '/3-4.png']
  },
  {
    id: 'idea-translator',
    title: 'Idea Translator Mini Program',
    enSubtitle: 'A mini program that turns raw ideas into structured expression.',
    cnSubtitle: '把模糊想法翻译成清晰表达的小程序。',
    summary: '通过引导式输入和结构化输出，帮助用户把零散想法整理成目标、问题、功能和行动路径。',
    description: '很多人并不是没有想法，而是不知道怎么把想法说清楚。这个小程序尝试把大模型变成一个"想法翻译器"：它不直接替用户下结论，而是通过引导式输出，把混乱的表达整理成更清晰的结构。',
    roles: ['Mini Program Designer', 'LLM Interaction Designer', 'Product Prototype Builder'],
    tags: ['LLM Interaction', 'Structured Output', 'Mini Program'],
    size: 'small',
    visualType: 'mobile',
    story: {
      why: '观察到非互联网背景的人在表达诉求时往往逻辑跳跃，难以被执行。',
      problem: '如何用最轻量的方式（微信小程序），将自然语言结构化。',
      role: '完成从产品概念、LLM 提示词工程到小程序界面的全栈设计。'
    },
    process: ['Voice/Text Input', 'LLM Processing', 'Structure Mapping', 'Actionable Output'],
    designDetail: {
      interaction: '单手操作友好，极简的大面积留白输入区。',
      architecture: '将结果分为：核心目标（一句话）、关键挑战、功能清单、立即执行。',
      visual: '保留原生 iOS/微信轻量感，去除冗余修饰，卡片式展示结果。'
    },
    reflection: '结构化是 LLM 最被低估的能力。下一步可以加入一键生成需求文档（PRD）功能。',
    cover: '/ChatGPT Image 2026年5月29日 01_25_19 (4).png',
    video: '/4.mp4',
    gallery: ['/4-1.png', '/4-2.png', '/4-3.png', '/4-4.png']
  }
];

// ── Dark-Only Theme (no toggle) ──
function useTheme() {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  return {};
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

const ImageGallery = ({ images }: { images?: string[] }) => {
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  if (!images || images.length === 0) return null;

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
      <h3 className="text-2xl font-medium tracking-tight mb-8" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Project Gallery</h3>
      <div className="flex flex-col gap-6">
        {images.map((img, i) => (
          <button key={i} aria-label="Enlarge image"
            className="relative group focus:outline-none focus:ring-2 rounded-2xl overflow-hidden w-full"
            onClick={() => openLightbox(img, i)}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center backdrop-blur-sm duration-500"
              style={{ background: 'var(--bg-card-10)' }}>
              <span className="text-sm font-mono tracking-widest px-5 py-2.5 rounded-full border"
                style={{ background: 'var(--bg-card-8)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}>View Full Size</span>
            </div>
            <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-[280px] md:h-[520px] object-cover rounded-2xl border shadow-2xl transition-transform duration-700 group-hover:scale-[1.01]"
              style={{ borderColor: 'var(--border-subtle)' }} />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ${lightboxImg ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'var(--bg-overlay)', backdropFilter: 'blur(24px)' }}
        onClick={() => setLightboxImg(null)}>
        <div className={`transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${lightboxImg ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
          {lightboxImg && <img src={lightboxImg} className="max-w-[95vw] max-h-[92vh] object-contain rounded-xl shadow-2xl" alt="Lightbox" />}
        </div>

        {/* Navigation arrows */}
        {lightboxImg && (
          <>
            <button onClick={prevImg} aria-label="Previous image"
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-md border hover:transition-colors focus:outline-none"
              style={{ background: 'var(--bg-card-10)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}>
              <ChevronRight size={24} className="rotate-180" />
            </button>
            <button onClick={nextImg} aria-label="Next image"
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-md border hover:transition-colors focus:outline-none"
              style={{ background: 'var(--bg-card-10)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}>
              <ChevronRight size={24} />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-mono tracking-wider"
              style={{ background: 'var(--bg-card-10)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
              {lightboxIdx + 1} / {images.length}
            </div>
          </>
        )}

        <button aria-label="Close lightbox" onClick={() => setLightboxImg(null)}
          className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 flex items-center justify-center rounded-full hover:transition-colors border backdrop-blur-md focus:outline-none focus:ring-2"
          style={{ background: 'var(--bg-card-10)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}>
          <X size={24} />
        </button>
      </div>
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

const SpotlightCard = ({ children, className = "", onClick, videoSrc }: { children: React.ReactNode, className?: string, onClick?: () => void, videoSrc?: string }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

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
      {videoSrc && (
        <video ref={videoRef} src={videoSrc} loop muted playsInline preload="metadata"
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-700 z-[1] ${opacity > 0 ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`} />
      )}
      <div className="relative w-full h-full flex flex-col md:flex-row pointer-events-none">
        {children}
      </div>
    </div>
  );
};

const NavBar = ({ onLogoClick }: { onLogoClick: () => void }) => {
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
        </div>
      </div>
    </nav>
  );
};

const ProjectModal = ({ project, onClose }: { project: any, onClose: () => void }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [dragY, setDragY] = useState(0);
  const startY = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      document.body.style.overflow = '';
      setIsVisible(false);
      setDragY(0);
    }
    return () => { document.body.style.overflow = ''; };
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
    if (dragY > 100) { setIsVisible(false); setTimeout(onClose, 300); }
    else { setDragY(0); }
  };

  if (!project) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-0 md:p-8 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ background: 'var(--modal-backdrop)', backdropFilter: isVisible ? 'blur(24px)' : 'blur(0px)' }}>
      <div className="absolute inset-0 cursor-pointer hidden md:block" onClick={onClose} />
      <div ref={scrollRef} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
        className={`relative w-full h-full md:h-auto md:max-w-5xl md:max-h-[90vh] overflow-y-auto border md:rounded-3xl shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-16 scale-95 opacity-0'}`}
        style={{ background: 'var(--modal-bg)', borderColor: 'var(--border-subtle)', transform: dragY > 0 ? `translateY(${dragY}px) scale(${1 - dragY/3000})` : '', transition: dragY > 0 ? 'none' : undefined }}>
        <button aria-label="Close Project Modal" onClick={onClose}
          className="sticky top-6 left-[calc(100%-1rem)] md:left-[calc(100%-3rem)] -translate-x-full md:translate-x-0 z-20 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md hover:transition-colors border focus:outline-none focus:ring-2"
          style={{ background: 'var(--bg-card-5)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}>
          <X size={18} />
        </button>

        <article className="p-6 md:p-16 pt-12 md:pt-16">
          <header className="mb-16">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 leading-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{project.title}</h2>
            <p className="text-xl mb-2" style={{ color: 'var(--text-secondary)' }}>{project.enSubtitle}</p>
            <p className="text-lg mb-8" style={{ color: 'var(--text-primary-60)' }}>{project.cnSubtitle}</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 rounded-full border text-xs font-mono" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>{tag}</span>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <div>
                <h4 className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>My Role</h4>
                <div className="flex flex-col gap-1">
                  {project.roles.map((role: string) => (
                    <span key={role} className="text-sm" style={{ color: 'var(--text-primary-80)' }}>{role}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>TL;DR</h4>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary-80)' }}>{project.summary}</p>
              </div>
            </div>
          </header>

          <figure className="w-full aspect-video rounded-2xl border mb-8 relative overflow-hidden shadow-2xl" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-primary)' }}>
            <img src={project.cover} alt={`${project.title} Cover`} className="w-full h-full object-cover" />
          </figure>

          <ImageGallery images={project.gallery} />

          <section className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 pt-16" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div className="md:col-span-1">
              <h3 className="text-2xl font-medium tracking-tight sticky top-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>The Story</h3>
            </div>
            <div className="md:col-span-2 space-y-12">
              <div className="pl-6" style={{ borderLeft: '1px solid var(--border-subtle)' }}>
                <h4 className="text-sm font-mono tracking-widest mb-4 uppercase" style={{ color: 'var(--text-primary-40)' }}>Why this project</h4>
                <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary-90)' }}>{project.story.why}</p>
              </div>
              <div className="pl-6" style={{ borderLeft: '1px solid var(--border-subtle)' }}>
                <h4 className="text-sm font-mono tracking-widest mb-4 uppercase" style={{ color: 'var(--text-primary-40)' }}>The Problem</h4>
                <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary-90)' }}>{project.story.problem}</p>
              </div>
            </div>
          </section>

          <section className="mb-16 pt-16" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <h3 className="text-2xl font-medium tracking-tight mb-8" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Process</h3>
            <div className="flex flex-col md:flex-row gap-4">
              {project.process.map((step: string, idx: number) => (
                <div key={idx} className="flex-1 p-6 rounded-2xl border relative overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
                  <span className="text-[120px] font-bold absolute -top-8 -right-4 pointer-events-none" style={{ color: 'var(--text-primary)', opacity: 0.02 }}>{idx + 1}</span>
                  <span className="text-xs font-mono mb-4 block" style={{ color: 'var(--text-muted)' }}>STEP 0{idx + 1}</span>
                  <p className="text-base font-medium relative z-10" style={{ color: 'var(--text-primary-80)' }}>{step}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 pt-16" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div className="md:col-span-1">
              <h3 className="text-2xl font-medium tracking-tight sticky top-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Design System</h3>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 rounded-2xl border transition-colors md:col-span-2" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
                <h4 className="text-sm font-mono tracking-widest uppercase mb-3" style={{ color: 'var(--text-primary-40)' }}>Interaction Logic</h4>
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-primary-90)' }}>{project.designDetail.interaction}</p>
              </div>
              <div className="p-8 rounded-2xl border transition-colors" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
                <h4 className="text-sm font-mono tracking-widest uppercase mb-3" style={{ color: 'var(--text-primary-40)' }}>Architecture</h4>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary-90)' }}>{project.designDetail.architecture}</p>
              </div>
              <div className="p-8 rounded-2xl border transition-colors" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
                <h4 className="text-sm font-mono tracking-widest uppercase mb-3" style={{ color: 'var(--text-primary-40)' }}>Visual Style</h4>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary-90)' }}>{project.designDetail.visual}</p>
              </div>
            </div>
          </section>

          <section className="p-8 md:p-16 rounded-3xl border text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(to bottom right, var(--bg-card-5), transparent)', borderColor: 'var(--border-subtle)' }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(var(--accent-rgb),0.05) 0%, transparent 70%)' }} />
            <h3 className="text-sm uppercase tracking-widest mb-8 font-mono" style={{ color: 'var(--text-muted)' }}>Reflection</h3>
            <p className="text-xl md:text-2xl leading-relaxed font-serif italic max-w-4xl mx-auto relative z-10" style={{ color: 'var(--text-primary-90)' }}>
              &ldquo;{project.reflection}&rdquo;
            </p>
          </section>
        </article>
      </div>
    </div>
  );
};

// ── Main Page ──

export default function PortfolioPage() {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [clickCount, setClickCount] = useState(0);
  useTheme();

  const handleLogoClick = useCallback(() => {
    setClickCount(c => c + 1);
    if (clickCount >= 4) {
      setClickCount(0);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([15, 30, 15]);
      }
    }
  }, [clickCount]);

  return (
    <div className="min-h-screen transition-colors duration-1000" style={{ color: 'var(--text-primary)' }}>
      <StaticFrostedBackground />
      <CursorAura />
      <ProgressBar />
      <NavBar onLogoClick={handleLogoClick} />

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
                <p>我关注的不是"AI 能不能生成结果"，而是一个复杂 AI 项目如何被用户理解、操作、判断和记住。</p>
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
                <SpotlightCard videoSrc={PROJECTS[0].video} className="h-full group" onClick={() => setSelectedProject(PROJECTS[0])}>
                  <div className="p-8 md:p-12 w-full md:w-1/2 flex flex-col justify-center z-20 transition-transform duration-500 group-hover:translate-x-2">
                    <h3 className="text-3xl font-bold mb-2 tracking-tight transition-colors" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary-90)' }}>{PROJECTS[0].title}</h3>
                    <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{PROJECTS[0].enSubtitle}</p>
                    <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-primary-70)' }}>{PROJECTS[0].summary}</p>
                    <div className="mt-auto flex items-center text-xs font-mono transition-colors" style={{ color: 'var(--text-tertiary)' }}>
                      View Case Study <ChevronRight size={14} className="ml-1" />
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 h-full absolute right-0 top-0 overflow-hidden border-l" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}>
                    <img src={PROJECTS[0].cover} alt={PROJECTS[0].title}
                      className={`absolute inset-0 w-full h-full object-cover object-right transition-all duration-1000 ease-out ${PROJECTS[0].video ? 'opacity-70 group-hover:opacity-0' : 'group-hover:scale-105 opacity-70'}`} />
                    <div className="absolute inset-0 z-[2] pointer-events-none"
                      style={{ background: 'linear-gradient(to top, var(--bg-tertiary), transparent), linear-gradient(to right, var(--bg-tertiary), transparent 80%)' }} />
                  </div>
                </SpotlightCard>
              </Reveal>

              {/* Project 02 */}
              <Reveal className="h-full">
                <SpotlightCard videoSrc={PROJECTS[1].video} className="h-full flex-col group" onClick={() => setSelectedProject(PROJECTS[1])}>
                  <div className="h-1/2 w-full absolute top-0 left-0 overflow-hidden border-b" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}>
                    <img src={PROJECTS[1].cover} alt={PROJECTS[1].title}
                      className={`w-full h-full object-cover object-center transition-all duration-1000 ease-out ${PROJECTS[1].video ? 'opacity-80 group-hover:opacity-0' : 'group-hover:scale-105 opacity-80'}`} />
                    <div className="absolute inset-0 z-[2] pointer-events-none" style={{ background: 'linear-gradient(to top, var(--bg-tertiary), transparent)', opacity: 0.9 }} />
                  </div>
                  <div className="p-8 flex flex-col w-full h-full justify-end z-20">
                    <h3 className="text-2xl font-bold mb-2 tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary-90)' }}>{PROJECTS[1].title}</h3>
                    <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>{PROJECTS[1].enSubtitle}</p>
                    <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--text-primary-70)' }}>{PROJECTS[1].summary}</p>
                    <div className="mt-4 flex items-center text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
                      View Case Study <ChevronRight size={14} className="ml-1" />
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>

              {/* Project 03 */}
              <Reveal className="h-full">
                <SpotlightCard videoSrc={PROJECTS[2].video} className="h-full flex-col group" onClick={() => setSelectedProject(PROJECTS[2])}>
                  <div className="h-1/2 w-full absolute top-0 left-0 overflow-hidden border-b" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}>
                    <img src={PROJECTS[2].cover} alt={PROJECTS[2].title}
                      className={`w-full h-full object-cover object-center transition-all duration-1000 ${PROJECTS[2].video ? 'opacity-80 group-hover:opacity-0' : 'group-hover:scale-105 opacity-80'}`} />
                    <div className="absolute inset-0 z-[2] pointer-events-none" style={{ background: 'linear-gradient(to top, var(--bg-tertiary), transparent)', opacity: 0.9 }} />
                  </div>
                  <div className="p-8 flex flex-col w-full h-full justify-end z-20">
                    <h3 className="text-2xl font-bold mb-2 tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary-90)' }}>{PROJECTS[2].title}</h3>
                    <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>{PROJECTS[2].enSubtitle}</p>
                    <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--text-primary-70)' }}>{PROJECTS[2].summary}</p>
                    <div className="mt-4 flex items-center text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
                      View Case Study <ChevronRight size={14} className="ml-1" />
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>

              {/* Project 04 */}
              <Reveal className="md:col-span-2 h-[300px]">
                <SpotlightCard videoSrc={PROJECTS[3].video} className="h-full flex-row group" onClick={() => setSelectedProject(PROJECTS[3])}>
                  <div className="w-full md:w-1/3 h-full absolute left-0 top-0 border-r overflow-hidden" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}>
                    <img src={PROJECTS[3].cover} alt={PROJECTS[3].title}
                      className={`absolute inset-0 w-full h-full object-cover object-[75%_center] transition-all duration-1000 ease-out ${PROJECTS[3].video ? 'opacity-80 group-hover:opacity-0' : 'group-hover:scale-105 opacity-80'}`} />
                    <div className="absolute inset-0 z-[2] pointer-events-none md:hidden" style={{ background: 'linear-gradient(to top, var(--bg-tertiary) 80%, transparent)' }} />
                    <div className="absolute inset-0 z-[2] pointer-events-none hidden md:block" style={{ background: 'linear-gradient(to right, transparent, var(--bg-tertiary) 60%)' }} />
                  </div>
                  <div className="p-8 md:p-12 w-full md:w-2/3 md:ml-auto h-full flex flex-col justify-center z-20 transition-transform duration-500 group-hover:-translate-x-2">
                    <h3 className="text-2xl font-bold mb-2 tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary-90)' }}>{PROJECTS[3].title}</h3>
                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{PROJECTS[3].enSubtitle}</p>
                    <p className="text-sm leading-relaxed max-w-lg" style={{ color: 'var(--text-primary-70)' }}>{PROJECTS[3].summary}</p>
                    <div className="mt-6 flex items-center text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
                      View Case Study <ChevronRight size={14} className="ml-1" />
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
