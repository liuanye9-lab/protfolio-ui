export type Project = {
  id: string;
  index: number;
  title: string;
  subtitle: string;
  cnSubtitle: string;
  summary: string;
  tags: string[];
  role: string[];
  why: string;
  what: string;
  result: string;
  cover: string;
  video?: string | null;
  images: string[];
  qrCode?: string | null;
  isMoreCard?: boolean;
  href?: string;
};

export const HOME_PROJECTS: Project[] = [
  {
    id: "stableagent-os",
    index: 1,
    title: "StableAgent OS",
    subtitle: "Personal operating layer for AI Coding Agents.",
    cnSubtitle: "面向 AI Coding Agent 的个人稳定层。",
    summary: "把表达习惯、失败经验、评测标准和执行轨迹沉淀成 Agent Capsule，让 AI Coding 工具更稳定地理解用户。",
    tags: ["Agent OS", "Agent Capsule", "Dashboard", "Bad Case"],
    role: ["AI Agent UI Designer", "Product System Designer", "Frontend Prototype"],
    why: "AI Coding 工具在长任务中容易跑偏、失忆、重复犯错，用户很难知道它到底如何理解任务。",
    what: "设计 Agent Capsule、Bad Case Bank、Skill Patch、Token Budget 和 Dashboard Observer，把使用习惯、失败经验和评测标准沉淀成可迁移系统。",
    result: "让不同 AI Coding 工具更稳定地理解用户意图，并让 Agent 执行过程可观察、可复盘、可改进。",
    cover: "/1-1.png",
    video: "/1.mp4",
    images: ["/1-1.png", "/1-2.png", "/1-3.png", "/1-4.png"],
    qrCode: null,
  },
  {
    id: "vibe-copilot",
    index: 2,
    title: "Vibe Copilot",
    subtitle: "Product framing tool before AI coding.",
    cnSubtitle: "把模糊产品想法转化为 Codex 可执行任务包。",
    summary: "在 AI 写代码前，把一句模糊想法整理成问题定义、MVP 范围、风险反证、验收标准和开发任务包。",
    tags: ["AI Coding", "Product Framing", "MVP Scope", "Codex Task Pack"],
    role: ["Product Designer", "Workflow Designer", "Frontend Prototype"],
    why: "很多 vibe coding 项目失败，不是因为 AI 不会写代码，而是人在开始前没有想清楚问题、用户、范围和验收标准。",
    what: "设计从 Raw Idea 到 Problem Framing、MVP Scope、Risk Review、DEV_SPEC、CODEX_TASK_PACK 的产品构思流程。",
    result: "让 AI Coding 前的输入从一句模糊想法，变成可判断、可执行、可验收的开发任务包。",
    cover: "/2-1.png",
    video: "/2.mp4",
    images: ["/2-1.png", "/2-2.png", "/2-3.png", "/2-4.png"],
    qrCode: "/2-5.png",
  },
  {
    id: "controlnet-workflow",
    index: 3,
    title: "ControlNet 工作流",
    subtitle: "A controllable AIGC workflow for interior design.",
    cnSubtitle: "面向空间概念设计的可控 AIGC 生成流程。",
    summary: "用 ControlNet、Prompt 层级、结果筛选和评估卡片，把空间草图与设计意图转化为稳定的 AI 视觉输出。",
    tags: ["ControlNet", "AIGC Pipeline", "Interior Design", "Evaluation"],
    role: ["AIGC Workflow Designer", "Spatial Visual Designer", "Prompt System Designer"],
    why: "普通 AI 生图容易随机、不可控、不可复盘，难以服务真实空间设计流程。",
    what: "将设计需求、空间图片、ControlNet 控制图、风格 Prompt、生成结果、评估和案例沉淀串成工作流。",
    result: "把 AI 生图从凭感觉出图，转化为可控、可评估、可复用的设计生产流程。",
    cover: "/3-1.png",
    video: "/3.mp4",
    images: ["/3-1.png", "/3-2.png", "/3-3.png", "/3-4.png"],
    qrCode: null,
  },
  {
    id: "more-projects",
    index: 4,
    title: "更多项目",
    subtitle: "More AI interface experiments.",
    cnSubtitle: "Vibe UI 与小白翻译器。",
    summary: "继续探索审美转译、前端设计 Prompt、普通用户 Prompt 翻译器和移动端 AI 交互。",
    tags: ["Vibe UI", "Mini Program", "Design Prompt", "LLM Interaction"],
    role: ["AI Agent UI Designer", "AIGC Workflow Designer"],
    why: "",
    what: "",
    result: "",
    cover: "/4-1.png",
    video: "/4.mp4",
    images: ["/4-1.png", "/5-1.png"],
    qrCode: null,
    isMoreCard: true,
    href: "/projects/more",
  },
];

export const MORE_PROJECTS: Project[] = [
  {
    id: "vibe-ui",
    index: 4,
    title: "Vibe UI",
    subtitle: "Translate visual taste into frontend UI prompts.",
    cnSubtitle: "把模糊审美需求翻译成可执行前端设计 Prompt。",
    summary: "把“高级一点”“不要 AI 味”这类模糊审美需求，转译成页面结构、视觉系统、组件规则、交互动效和验收标准。",
    tags: ["Vibe UI", "Design Prompt", "Anti-AI Look", "Frontend UI"],
    role: ["AI Product Designer", "Design System Translator", "Prompt Designer"],
    why: "很多 AI Coding 页面功能能跑，但视觉像模板，因为用户不知道如何描述审美、层级、组件规则和验收标准。",
    what: "设计设计反问系统、视觉方向推荐、Design Execution Pack 和反 AI 味诊断流程。",
    result: "让模糊审美需求变成 AI Coding 工具能执行的前端设计任务书。",
    cover: "/4-1.png",
    video: null,
    images: ["/4-1.png", "/4-2.png", "/4-3.png", "/4-4.png"],
    qrCode: null,
  },
  {
    id: "xiaobai-translator",
    index: 5,
    title: "小白翻译器",
    subtitle: "Idea Translator Mini Program.",
    cnSubtitle: "把普通人的模糊想法翻译成 AI 能执行的结构化 Prompt。",
    summary: "微信小程序：通过场景识别、语义拆解、追问补全和质量评分，把模糊想法转化为可复用 Prompt。",
    tags: ["Mini Program", "Prompt Semantic Agent", "LLM Interaction", "Structured Output"],
    role: ["Mini Program Designer", "LLM Interaction Designer", "Product Prototype Builder"],
    why: "很多人不是不会用 AI，而是不知道怎么把需求说清楚。",
    what: "设计模糊想法输入、场景识别、语义拆解、追问补全、Prompt 生成、质量评分、小白解释和收藏历史。",
    result: "让大模型从替用户回答，变成帮助用户整理表达的任务转译工具。",
    cover: "/5-1.png",
    video: null,
    images: ["/5-1.png", "/5-2.png", "/5-3.png", "/5-4.png"],
    qrCode: "/5-5.png",
  },
];
