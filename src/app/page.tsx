"use client";

import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { ArrowRight, Mail, X, ChevronRight, Layout, Workflow, MonitorSmartphone } from 'lucide-react';

// --- Custom Brand Icons (lucide-react 1.17+ 已移除品牌图标) ---
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

// --- Configuration & Data ---

// 采用更平滑、带有轻微物理惯性的贝塞尔曲线，取代原本生硬的线性过渡
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
    gallery: [
      '/ChatGPT Image 2026年5月29日 01_25_19 (1).png'
    ]
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
    gallery: [
      '/ChatGPT Image 2026年5月29日 01_25_19 (2).png'
    ]
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
    gallery: [
      '/ChatGPT Image 2026年5月29日 01_25_19 (3).png'
    ]
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
    gallery: [
      '/ChatGPT Image 2026年5月29日 01_25_19 (4).png'
    ]
  }
];

// --- Theme Context ---
const ThemeContext = React.createContext({
  isSilverBlue: false
});

// --- Utilities & Hooks ---

// 优化点 1：将 `IntersectionObserver` 抽象为复用钩子
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

// --- Components ---

// 优化点 2：DOM 隔离的零延迟进度条，避免 React 树的重渲染
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
    <div className="fixed top-0 left-0 w-full h-[3px] bg-white/[0.02] z-50 origin-left">
      <div 
        ref={progressRef}
        className="h-full bg-white/40 origin-left scale-x-0"
        style={{ transition: 'transform 0.1s ease-out' }}
      />
    </div>
  );
};

// 优化点 3：底层 Canvas 有机环境光引擎
const HeroVisual = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isSilverBlue } = useContext(ThemeContext);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    mouse.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth / 2;
    let height = canvas.height = window.innerHeight;
    
    // 响应窗口调整
    const handleResize = () => {
       width = canvas.width = window.innerWidth / 2;
       height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 粒子系统：生成 4 个浮动光球
    const orbs = Array.from({ length: 4 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 150 + 100,
    }));

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 根据主题动态调整流体基色
      const baseColor = isSilverBlue ? '168, 192, 216' : '255, 255, 255';
      
      // 使用更柔和的混合模式
      ctx.globalCompositeOperation = 'screen';

      orbs.forEach((orb, i) => {
        // 缓慢的边界碰撞
        if (orb.x < 0 || orb.x > width) orb.vx *= -1;
        if (orb.y < 0 || orb.y > height) orb.vy *= -1;
        orb.x += orb.vx;
        orb.y += orb.vy;

        // 鼠标产生的微弱引力效应
        const dx = mouse.current.x - (window.innerWidth / 2) - orb.x + width/2;
        const dy = mouse.current.y - orb.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 400) {
          orb.x += dx * 0.001;
          orb.y += dy * 0.001;
        }

        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        // 主光球和辅助光球的透明度区分
        const alpha = i === 0 ? 0.08 : 0.04;
        gradient.addColorStop(0, `rgba(${baseColor}, ${alpha})`);
        gradient.addColorStop(1, `rgba(${baseColor}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isSilverBlue]);

  return (
    <div className="relative w-full h-[50vh] md:h-full flex items-center justify-center perspective-[1000px]">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none opacity-80" 
        style={{ width: '100%', height: '100%', filter: 'blur(30px)' }}
      />
      
      {/* 维持你原有的高分辨率图片浮窗，利用 CSS 3D 透视 */}
      <div 
        className="absolute w-64 h-40 md:w-96 md:h-56 border border-white/10 bg-black backdrop-blur-2xl rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-1000 overflow-hidden"
        style={{ transform: `rotateX(15deg) rotateY(-15deg) translateZ(50px)` }}
      >
        <img 
          src={PROJECTS[0].cover} 
          alt="StableAgent OS" 
          className="w-full h-full object-cover opacity-90" 
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent pointer-events-none"></div>
      </div>

      <div 
        className="absolute w-56 h-32 md:w-80 md:h-48 border border-white/10 bg-[#111] backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl z-10 transition-all duration-1000 overflow-hidden"
        style={{ transform: `rotateX(5deg) rotateY(10deg) translateZ(100px)` }}
      >
        <img 
          src={PROJECTS[2].cover} 
          alt="ControlNet Workflow" 
          className="w-full h-full object-cover opacity-90" 
        />
        <div className="absolute inset-0 border-[rgba(var(--accent-rgb),0.2)] border transition-colors duration-1000 rounded-2xl pointer-events-none"></div>
      </div>
    </div>
  );
};

const ImageGallery = ({ images }: { images?: string[] }) => {
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <div className="mb-16">
       <h3 className="text-2xl font-medium text-white tracking-tight mb-8">Visual Gallery</h3>
       {/* 增加了惯性滑动缓冲支持 */}
       <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden touch-pan-x" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
         {images.map((img, i) => (
            <button 
              key={i} 
              aria-label="Enlarge image"
              className="min-w-[85%] md:min-w-[65%] snap-center relative group focus:outline-none focus:ring-2 focus:ring-white/30 rounded-2xl" 
              onClick={() => setLightboxImg(img)}
            >
               <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-2xl flex items-center justify-center backdrop-blur-sm duration-500">
                  <span className="text-white text-sm font-mono tracking-widest bg-black/50 px-4 py-2 rounded-full border border-white/10">Enlarge</span>
               </div>
               <img src={img} alt={`Gallery ${i}`} className="w-full h-[300px] md:h-[450px] object-cover rounded-2xl border border-white/5 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]" />
            </button>
         ))}
       </div>
       
       <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl transition-all duration-500 ${lightboxImg ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setLightboxImg(null)}>
          <div className={`transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${lightboxImg ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
             {lightboxImg && <img src={lightboxImg} className="max-w-[95vw] max-h-[95vh] object-contain rounded-xl shadow-2xl" alt="Lightbox" />}
          </div>
          <button 
             aria-label="Close lightbox"
             className="absolute top-6 right-6 md:top-10 md:right-10 text-white w-12 h-12 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-colors border border-white/10 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white"
          >
            <X size={24} />
          </button>
       </div>
    </div>
  );
};

const Reveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const [ref, isVisible] = useIntersectionObserver();
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transitionTimingFunction: BEZIER,
        transitionDelay: `${delay}ms`
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
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x, y });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;
    setRotation({ x: rotateX, y: rotateY });
  };

  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleMouseEnter = () => {
    setOpacity(1);
    playVideo();
  };

  const handleMouseLeave = () => {
    setOpacity(0);
    setRotation({ x: 0, y: 0 });
    pauseVideo();
  };

  const handleTouchStart = () => {
    setOpacity(1);
    playVideo();
  };

  const handleTouchEnd = () => {
    setOpacity(0);
    setRotation({ x: 0, y: 0 });
    pauseVideo();
  };

  return (
    <div
      ref={divRef}
      role="button"
      tabIndex={0}
      aria-label="View Project Case Study"
      onKeyDown={(e) => { if (e.key === 'Enter' && onClick) onClick(); }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={onClick}
      className={`relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0A0A0A]/50 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-white/[0.15] cursor-pointer group focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-4 focus:ring-offset-black ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateY(${opacity > 0 ? '-4px' : '0'})`,
        transitionTimingFunction: BEZIER,
      }}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(var(--accent-rgb),.08), transparent 40%)`,
        }}
      />

      {videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          loop
          muted
          playsInline
          preload="metadata"
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-700 z-[1] ${opacity > 0 ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
        />
      )}

      <div className="relative w-full h-full flex flex-col md:flex-row pointer-events-none">
         {children}
      </div>
    </div>
  );
};

const IntroScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 400);
    const t2 = setTimeout(() => setStage(2), 1800);
    const t3 = setTimeout(() => {
      setStage(3);
      setTimeout(onComplete, 900);
    }, 3200);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  if (stage === 3) return null;

  return (
    <div className={`fixed inset-0 z-50 bg-black transition-opacity duration-700 ${stage === 2 ? 'opacity-0' : 'opacity-100'}`} style={{ transitionTimingFunction: BEZIER }}>
      {/* 乱序摆放的巨大字母背景 */}
      <div className="absolute inset-0 overflow-hidden">
        <span
          className={`absolute font-bold tracking-tighter text-white transition-all duration-1000 ${stage >= 1 ? 'opacity-[0.04] translate-y-0' : 'opacity-0 translate-y-12'}`}
          style={{ transitionTimingFunction: BEZIER, fontSize: '42vw', left: '-5%', top: '-8%', lineHeight: 1 }}
        >
          L
        </span>
        <span
          className={`absolute font-bold tracking-tighter text-white transition-all duration-1000 delay-100 ${stage >= 1 ? 'opacity-[0.05] translate-y-0' : 'opacity-0 translate-y-12'}`}
          style={{ transitionTimingFunction: BEZIER, fontSize: '38vw', right: '-8%', top: '5%', lineHeight: 1 }}
        >
          A
        </span>
        <span
          className={`absolute font-bold tracking-tighter text-white transition-all duration-1000 delay-200 ${stage >= 1 ? 'opacity-[0.035] translate-y-0' : 'opacity-0 translate-y-12'}`}
          style={{ transitionTimingFunction: BEZIER, fontSize: '48vw', left: '25%', bottom: '-15%', lineHeight: 1 }}
        >
          Y
        </span>
      </div>

      {/* 左下角 Hi, I'm Lay */}
      <div className="absolute left-8 bottom-12 md:left-16 md:bottom-20">
        <div className="overflow-hidden">
          <p
            className={`text-white text-xl md:text-2xl font-medium tracking-tight transition-transform duration-700 delay-500 ${stage >= 1 ? 'translate-y-0' : 'translate-y-full'}`}
            style={{ transitionTimingFunction: BEZIER }}
          >
            Hi, I&rsquo;m Lay
          </p>
        </div>
      </div>
    </div>
  );
};

const NavBar = ({ onLogoClick }: { onLogoClick: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const { isSilverBlue } = useContext(ThemeContext);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ${scrolled ? 'w-[90%] md:w-[400px]' : 'w-[90%] md:w-[480px]'}`}>
      <div className="flex items-center justify-between px-6 py-3 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl transition-colors duration-1000">
        <button 
          className="text-white font-medium tracking-tight cursor-pointer relative focus:outline-none" 
          onClick={() => {
            window.scrollTo({top:0, behavior:'smooth'});
            onLogoClick();
          }}
        >
          Lay
          <span className={`absolute -top-1 -right-2.5 w-1.5 h-1.5 rounded-full transition-all duration-1000 ${isSilverBlue ? 'bg-[rgb(var(--accent-rgb))] shadow-[0_0_8px_rgb(var(--accent-rgb))] opacity-100' : 'opacity-0'}`}></span>
        </button>
        <div className="flex gap-6 text-sm text-[#8F8F8F]">
          <button onClick={() => scrollTo('works')} className="hover:text-white transition-colors focus:outline-none">Works</button>
          <button onClick={() => scrollTo('process')} className="hover:text-white transition-colors focus:outline-none">Process</button>
          <button onClick={() => scrollTo('about')} className="hover:text-white transition-colors focus:outline-none">About</button>
        </div>
      </div>
    </nav>
  );
};

const ProjectModal = ({ project, onClose }: { project: any, onClose: () => void }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // 优化点 5：支持移动端手势下拉阻尼关闭
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
    // 只有在内容位于顶部时才允许拖拽整个 Modal
    if (scrollRef.current && scrollRef.current.scrollTop > 0) return;
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY.current;
    if (deltaY > 0 && (!scrollRef.current || scrollRef.current.scrollTop <= 0)) {
       // 制造阻尼感 (Damping)
       setDragY(deltaY * 0.4); 
    }
  };

  const handleTouchEnd = () => {
    if (dragY > 100) {
      setIsVisible(false); // 提前触发退出动画
      setTimeout(onClose, 300);
    } else {
      setDragY(0); // 回弹
    }
  };

  if (!project) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-0 md:p-8 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isVisible ? 'opacity-100 backdrop-blur-xl bg-black/60' : 'opacity-0 backdrop-blur-none bg-black/0'}`}
    >
      <div className="absolute inset-0 cursor-pointer hidden md:block" onClick={onClose} />
      
      <div 
        ref={scrollRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full h-full md:h-auto md:max-w-5xl md:max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-white/10 md:rounded-3xl shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-16 scale-95 opacity-0'}`}
        style={{
           transform: dragY > 0 ? `translateY(${dragY}px) scale(${1 - dragY/3000})` : '',
           transition: dragY > 0 ? 'none' : undefined
        }}
      >
        <button 
          aria-label="Close Project Modal"
          onClick={onClose}
          className="sticky top-6 left-[calc(100%-1rem)] md:left-[calc(100%-3rem)] -translate-x-full md:translate-x-0 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white"
        >
          <X size={18} />
        </button>

        <article className="p-6 md:p-16 pt-12 md:pt-16">
          <header className="mb-16">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4 leading-tight">{project.title}</h2>
            <p className="text-xl text-[#8F8F8F] mb-2">{project.enSubtitle}</p>
            <p className="text-lg text-white/60 mb-8">{project.cnSubtitle}</p>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-[#8F8F8F]">{tag}</span>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
              <div>
                <h4 className="text-xs uppercase tracking-widest text-[#474747] mb-2">My Role</h4>
                <div className="flex flex-col gap-1">
                  {project.roles.map((role: string) => (
                    <span key={role} className="text-sm text-white/80">{role}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest text-[#474747] mb-2">TL;DR</h4>
                <p className="text-sm text-white/80 leading-relaxed">{project.summary}</p>
              </div>
            </div>
          </header>

          <figure className="w-full aspect-video rounded-2xl border border-white/5 mb-16 relative overflow-hidden bg-black shadow-2xl">
             <img 
                src={project.cover} 
                alt={`${project.title} Cover`} 
                className="w-full h-full object-cover" 
             />
          </figure>

          <ImageGallery images={project.gallery?.filter((img: string) => img !== project.cover)} />

          {/* 优化点 6：运用 Editorial 社论风格进行数据排版，模拟 MDX 文档质感 */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 border-t border-white/5 pt-16">
            <div className="md:col-span-1">
              <h3 className="text-2xl font-medium text-white tracking-tight sticky top-6">The Story</h3>
            </div>
            <div className="md:col-span-2 space-y-12">
              <div className="pl-6 border-l border-white/10">
                <h4 className="text-sm font-mono tracking-widest text-white/40 mb-4 uppercase">Why this project</h4>
                <p className="text-white/90 text-lg leading-relaxed">{project.story.why}</p>
              </div>
              <div className="pl-6 border-l border-white/10">
                <h4 className="text-sm font-mono tracking-widest text-white/40 mb-4 uppercase">The Problem</h4>
                <p className="text-white/90 text-lg leading-relaxed">{project.story.problem}</p>
              </div>
            </div>
          </section>

          <section className="mb-16 border-t border-white/5 pt-16">
            <h3 className="text-2xl font-medium text-white tracking-tight mb-8">Process</h3>
            <div className="flex flex-col md:flex-row gap-4">
              {project.process.map((step: string, idx: number) => (
                <div key={idx} className="flex-1 p-6 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden">
                  <span className="text-[120px] font-bold text-white/[0.02] absolute -top-8 -right-4 pointer-events-none">{idx + 1}</span>
                  <span className="text-xs font-mono text-[#474747] mb-4 block">STEP 0{idx + 1}</span>
                  <p className="text-base text-white/80 font-medium relative z-10">{step}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 border-t border-white/5 pt-16">
            <div className="md:col-span-1">
              <h3 className="text-2xl font-medium text-white tracking-tight sticky top-6">Design System</h3>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 rounded-2xl border border-white/10 bg-black/50 hover:bg-white/[0.02] transition-colors md:col-span-2">
                <h4 className="text-sm text-white/40 font-mono tracking-widest uppercase mb-3">Interaction Logic</h4>
                <p className="text-white/90 text-base leading-relaxed">{project.designDetail.interaction}</p>
              </div>
              <div className="p-8 rounded-2xl border border-white/10 bg-black/50 hover:bg-white/[0.02] transition-colors">
                <h4 className="text-sm text-white/40 font-mono tracking-widest uppercase mb-3">Architecture</h4>
                <p className="text-white/90 text-sm leading-relaxed">{project.designDetail.architecture}</p>
              </div>
              <div className="p-8 rounded-2xl border border-white/10 bg-black/50 hover:bg-white/[0.02] transition-colors">
                <h4 className="text-sm text-white/40 font-mono tracking-widest uppercase mb-3">Visual Style</h4>
                <p className="text-white/90 text-sm leading-relaxed">{project.designDetail.visual}</p>
              </div>
            </div>
          </section>

          <section className="p-8 md:p-16 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--accent-rgb),0.05)_0%,transparent_70%)] pointer-events-none" />
            <h3 className="text-sm uppercase tracking-widest text-[#474747] mb-8 font-mono">Reflection</h3>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-serif italic max-w-4xl mx-auto relative z-10">
              "{project.reflection}"
            </p>
          </section>

        </article>
      </div>
    </div>
  );
};

// --- Main Application ---

export default function PortfolioPage() {
  const [introDone, setIntroDone] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  
  const [clickCount, setClickCount] = useState(0);
  const [isSilverBlue, setIsSilverBlue] = useState(false);

  const handleLogoClick = useCallback(() => {
    setClickCount(c => c + 1);
    if (clickCount >= 4) { 
       setIsSilverBlue(prev => !prev);
       setClickCount(0);
       // 优化点 7：结合 Web API 植入细腻触觉反馈，打造高级彩蛋交互
       if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([15, 30, 15]);
       }
    }
  }, [clickCount]);

  const theme = { isSilverBlue };

  useEffect(() => {
    if (!introDone) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      window.scrollTo(0, 0);
    }
  }, [introDone]);

  return (
    <ThemeContext.Provider value={theme}>
      <style>{`
        :root {
          --accent-rgb: ${isSilverBlue ? '168, 192, 216' : '255, 255, 255'};
        }
        ::selection {
          background-color: rgba(var(--accent-rgb), 0.3);
          color: white;
        }
        body {
          background-color: black;
          scroll-behavior: smooth;
        }
      `}</style>
      <div className="min-h-screen bg-black text-white font-sans transition-colors duration-1000">
        {!introDone && <IntroScreen onComplete={() => setIntroDone(true)} />}
        <ProgressBar />
        <NavBar onLogoClick={handleLogoClick} />
        
        <main className="relative z-10">
          <section className="min-h-screen pt-24 pb-12 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 md:px-12 relative overflow-hidden">
            <div className="w-full md:w-1/2 z-20 pt-20 md:pt-0">
              <Reveal delay={200}>
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-1">刘安烨</h2>
                  <span className="text-sm font-mono tracking-wider text-[#8F8F8F]">AI Agent UI Designer</span>
                </div>
              </Reveal>

              <Reveal delay={400}>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[1.1] mb-8">
                  Designing interfaces for <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#474747] transition-all duration-1000" style={isSilverBlue ? { backgroundImage: 'linear-gradient(to right, rgb(var(--accent-rgb)), #474747)' } : {}}>AI Agent products</span>.
                </h1>
              </Reveal>

              <Reveal delay={600}>
                <p className="text-lg md:text-xl text-white/80 mb-4 font-medium leading-relaxed">
                  我擅长把 AI 项目从概念、逻辑、视觉到前端原型完整设计出来。
                </p>
                <p className="text-sm md:text-base text-[#474747] leading-relaxed max-w-lg mb-12">
                  设计训练让我对视觉秩序、叙事路径和体验节奏更敏感；AI 与前端实践让我理解产品背后的流程、模型能力和工程边界。
                </p>
              </Reveal>

              <Reveal delay={800}>
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => document.getElementById('works')?.scrollIntoView({behavior:'smooth'})} className="px-6 py-3 rounded-full bg-white text-black font-medium text-sm hover:bg-white/90 transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black">
                    View Works <ArrowRight size={16} />
                  </button>
                  <button onClick={() => document.getElementById('process')?.scrollIntoView({behavior:'smooth'})} className="px-6 py-3 rounded-full bg-transparent border border-white/20 text-white font-medium text-sm hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black">
                    My Process
                  </button>
                  <button onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})} className="px-6 py-3 rounded-full bg-transparent border border-white/20 text-white font-medium text-sm hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black">
                    Contact
                  </button>
                </div>
              </Reveal>
            </div>

            {/* 右侧人像照片背景 */}
            <div className="absolute right-0 top-0 h-full w-full md:w-[55%] lg:w-[50%] pointer-events-none z-0 hidden md:block">
              <img
                src="/home-portrait-bg.jpg"
                alt="Lay Liu Portrait"
                className="w-full h-full object-cover object-top opacity-40"
              />
              {/* 左侧渐变遮罩，让照片与黑色背景自然过渡 */}
              <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-black via-black/80 to-transparent" />
              {/* 底部渐变遮罩 */}
              <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black to-transparent" />
            </div>
          </section>

          <section className="py-24 md:py-32 bg-[#050505] relative border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <Reveal>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">From concept to prototype.</h2>
                <p className="text-lg text-[#8F8F8F] mb-6">从概念到可交互原型。</p>
                <div className="max-w-3xl text-[#8F8F8F] text-sm md:text-base leading-relaxed mb-16 space-y-4">
                  <p>我关注的不是"AI 能不能生成结果"，而是一个复杂 AI 项目如何被用户理解、操作、判断和记住。</p>
                  <p>设计训练让我对视觉秩序、叙事路径和体验节奏更敏感；AI 与前端实践让我理解产品背后的流程、模型能力和工程边界。</p>
                </div>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Reveal delay={100}>
                  <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/[0.08] transition-colors group">
                    <Layout className="w-8 h-8 text-white/50 mb-6 group-hover:text-white transition-colors" />
                    <h3 className="text-xl font-medium mb-3">Interface Design</h3>
                    <p className="text-sm text-[#8F8F8F]">把复杂任务变成清晰界面。</p>
                  </div>
                </Reveal>
                <Reveal delay={200}>
                  <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/[0.08] transition-colors group">
                    <Workflow className="w-8 h-8 text-white/50 mb-6 group-hover:text-white transition-colors" />
                    <h3 className="text-xl font-medium mb-3">AI Workflow</h3>
                    <p className="text-sm text-[#8F8F8F]">把模糊想法变成可执行流程。</p>
                  </div>
                </Reveal>
                <Reveal delay={300}>
                  <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/[0.08] transition-colors group">
                    <MonitorSmartphone className="w-8 h-8 text-white/50 mb-6 group-hover:text-white transition-colors" />
                    <h3 className="text-xl font-medium mb-3">AIGC Visual System</h3>
                    <p className="text-sm text-[#8F8F8F]">把 AI 生成结果变成统一视觉语言。</p>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

        <section id="works" className="py-24 md:py-32 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03),transparent_50%)] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
            <Reveal>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Selected Works</h2>
              <p className="text-lg md:text-xl text-[#8F8F8F] mb-2">Four projects that define my current direction.</p>
              <p className="text-sm text-[#474747] mb-16">四个项目，构成我目前的 AI 设计方向。</p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 auto-rows-[400px]">

              <Reveal className="md:col-span-2 h-full">
                <SpotlightCard videoSrc={PROJECTS[0].video} className="h-full group" onClick={() => setSelectedProject(PROJECTS[0])}>
                  <div className="p-8 md:p-12 w-full md:w-1/2 flex flex-col justify-center z-20 transition-transform duration-500 group-hover:translate-x-2">
                    <h3 className="text-3xl font-bold mb-2 tracking-tight group-hover:text-white text-white/90 transition-colors">{PROJECTS[0].title}</h3>
                    <p className="text-sm text-[#8F8F8F] mb-6">{PROJECTS[0].enSubtitle}</p>
                    <p className="text-sm text-white/70 leading-relaxed mb-8">{PROJECTS[0].summary}</p>
                    <div className="mt-auto flex items-center text-xs font-mono text-white/50 group-hover:text-white transition-colors">
                      View Case Study <ChevronRight size={14} className="ml-1" />
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 h-full absolute right-0 top-0 overflow-hidden bg-black border-l border-white/5">
                     <img
                        src={PROJECTS[0].cover}
                        alt={PROJECTS[0].title}
                        className={`absolute inset-0 w-full h-full object-cover object-right transition-all duration-1000 ease-out opacity-70 ${PROJECTS[0].video ? 'group-hover:opacity-0' : 'group-hover:scale-105 group-hover:opacity-100'}`}
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent md:bg-gradient-to-r md:from-[#0A0A0A] md:via-[#0A0A0A]/80 md:to-transparent z-[2] pointer-events-none"></div>
                  </div>
                </SpotlightCard>
              </Reveal>

              <Reveal className="h-full">
                <SpotlightCard videoSrc={PROJECTS[1].video} className="h-full flex-col group" onClick={() => setSelectedProject(PROJECTS[1])}>
                  <div className="h-1/2 w-full absolute top-0 left-0 overflow-hidden bg-black border-b border-white/5">
                     <img
                        src={PROJECTS[1].cover}
                        alt={PROJECTS[1].title}
                        className={`w-full h-full object-cover object-center transition-all duration-1000 ease-out ${PROJECTS[1].video ? 'opacity-80 group-hover:opacity-0' : 'group-hover:scale-105 group-hover:opacity-100 opacity-80'}`}
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-90 z-[2] pointer-events-none"></div>
                  </div>
                  <div className="p-8 flex flex-col w-full h-full justify-end z-20">
                    <h3 className="text-2xl font-bold mb-2 tracking-tight group-hover:text-white text-white/90">{PROJECTS[1].title}</h3>
                    <p className="text-xs text-[#8F8F8F] mb-4">{PROJECTS[1].enSubtitle}</p>
                    <p className="text-sm text-white/70 leading-relaxed line-clamp-3">{PROJECTS[1].summary}</p>
                    <div className="mt-4 flex items-center text-xs font-mono text-white/50 group-hover:text-white transition-colors">
                      View Case Study <ChevronRight size={14} className="ml-1" />
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>

              <Reveal className="h-full">
                <SpotlightCard videoSrc={PROJECTS[2].video} className="h-full flex-col group" onClick={() => setSelectedProject(PROJECTS[2])}>
                  <div className="h-1/2 w-full absolute top-0 left-0 overflow-hidden bg-black border-b border-white/5">
                     <img
                        src={PROJECTS[2].cover}
                        alt={PROJECTS[2].title}
                        className={`w-full h-full object-cover object-center transition-all duration-1000 ${PROJECTS[2].video ? 'opacity-80 group-hover:opacity-0' : 'group-hover:opacity-100 group-hover:scale-105 opacity-80'}`}
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-90 z-[2] pointer-events-none"></div>
                  </div>
                  <div className="p-8 flex flex-col w-full h-full justify-end z-20">
                    <h3 className="text-2xl font-bold mb-2 tracking-tight group-hover:text-white text-white/90">{PROJECTS[2].title}</h3>
                    <p className="text-xs text-[#8F8F8F] mb-4">{PROJECTS[2].enSubtitle}</p>
                    <p className="text-sm text-white/70 leading-relaxed line-clamp-3">{PROJECTS[2].summary}</p>
                    <div className="mt-4 flex items-center text-xs font-mono text-white/50 group-hover:text-white transition-colors">
                      View Case Study <ChevronRight size={14} className="ml-1" />
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>

              <Reveal className="md:col-span-2 h-[300px]">
                <SpotlightCard videoSrc={PROJECTS[3].video} className="h-full flex-row group" onClick={() => setSelectedProject(PROJECTS[3])}>
                   <div className="w-full md:w-1/3 h-full absolute left-0 top-0 bg-black border-r border-white/5 overflow-hidden">
                      <img
                         src={PROJECTS[3].cover}
                         alt={PROJECTS[3].title}
                         className={`absolute inset-0 w-full h-full object-cover object-[75%_center] transition-all duration-1000 ease-out ${PROJECTS[3].video ? 'opacity-80 group-hover:opacity-0' : 'group-hover:scale-105 group-hover:opacity-100 opacity-80'}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-[#0A0A0A]/60 md:to-[#0A0A0A] z-[2] pointer-events-none"></div>
                   </div>
                   <div className="p-8 md:p-12 w-full md:w-2/3 md:ml-auto h-full flex flex-col justify-center z-20 transition-transform duration-500 group-hover:-translate-x-2">
                    <h3 className="text-2xl font-bold mb-2 tracking-tight group-hover:text-white text-white/90">{PROJECTS[3].title}</h3>
                    <p className="text-sm text-[#8F8F8F] mb-4">{PROJECTS[3].enSubtitle}</p>
                    <p className="text-sm text-white/70 leading-relaxed max-w-lg">{PROJECTS[3].summary}</p>
                    <div className="mt-6 flex items-center text-xs font-mono text-white/50 group-hover:text-white transition-colors">
                      View Case Study <ChevronRight size={14} className="ml-1" />
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>

            </div>
          </div>
        </section>

        <section id="process" className="py-24 md:py-32 bg-[#050505] border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <Reveal>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">My Process</h2>
              <p className="text-lg text-[#8F8F8F] mb-2">From concept to interactive prototype.</p>
              <p className="text-sm text-[#474747] mb-16">从概念到可交互原型。</p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 pointer-events-none" />

              {[
                { title: 'Decode', desc: '理解真实问题' },
                { title: 'Structure', desc: '拆解流程与层级' },
                { title: 'Visualize', desc: '转化为界面语言' },
                { title: 'Prototype', desc: '完成前端原型' }
              ].map((step, idx) => (
                <Reveal key={step.title} delay={idx * 100} className="relative z-10">
                  <div className="p-8 bg-black border border-white/10 rounded-3xl h-full flex flex-col group hover:border-white/30 transition-colors duration-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 text-[100px] font-bold text-white/[0.02] leading-none pointer-events-none group-hover:text-white/[0.05] transition-colors">
                      {idx + 1}
                    </div>
                    <span className="text-xs font-mono tracking-widest text-[#474747] mb-6">STEP 0{idx + 1}</span>
                    <h3 className="text-2xl font-bold mb-4 tracking-tight">{step.title}</h3>
                    <p className="text-sm text-[#8F8F8F] leading-relaxed mt-auto group-hover:text-white/80 transition-colors">
                      {step.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-24 md:py-32 relative">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16">
            <Reveal>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12">About Lay</h2>
              <div className="space-y-6 text-[#8F8F8F] text-base md:text-lg leading-relaxed">
                <p className="text-white/70 font-medium">
                  东北农业大学｜双一流｜211<br />
                  设计学背景｜辅修计算机科学
                </p>
                <p>
                  设计让我对视觉秩序、叙事路径和体验节奏更敏感；AI 与前端实践让我理解产品背后的流程、模型能力和工程边界。
                </p>
                <p className="text-white/90 font-medium">
                  我擅长把一个 AI 项目从概念、逻辑、视觉到前端原型完整设计出来。
                </p>
              </div>
            </Reveal>

            <Reveal delay={200} className="flex flex-col justify-center">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#474747] mb-6">Capabilities</h3>
              <div className="flex flex-wrap gap-3">
                {['Interface Design', 'AI Agent UI', 'AIGC Workflow', 'Frontend Prototyping', 'Visual Storytelling', 'Prompt System'].map(skill => (
                  <span key={skill} className="px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-sm text-white/80 hover:bg-white/10 transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section id="contact" className="py-24 md:py-32 bg-[#050505] border-t border-white/5 relative overflow-hidden">
           <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
              <h1 className="text-[20vw] font-bold tracking-tighter">LAY</h1>
           </div>
          <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
            <Reveal>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Keep exploring, keep improving</h2>
              <p className="text-xl text-[#8F8F8F] mb-12">保持探索，持续进步</p>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
                <a href="tel:136-5731-0228" className="flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/10 transition-all duration-300 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black">
                  <span className="text-sm text-[#8F8F8F]">phone</span>
                  <span className="text-sm">136-5731-0228</span>
                </a>
                <a href="mailto:3130577758@qq.com" className="flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-white/90 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black">
                  <Mail size={18} />
                  <span>3130577758@qq.com</span>
                </a>
              </div>
            </Reveal>
          </div>

          <div className="mt-32 pt-8 border-t border-white/10 text-center text-xs font-mono text-[#474747]">
            &copy; {new Date().getFullYear()} Lay Liu. Designed &amp; Built with React + Tailwind.
          </div>
        </section>
      </main>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      </div>
    </ThemeContext.Provider>
  );
}
