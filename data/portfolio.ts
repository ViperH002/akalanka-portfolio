import { PortfolioProject } from "@/types";
import { PortfolioKnowledge } from "@/types/ai";

/**
 * ==============================================================================
 * PORTFOLIO KNOWLEDGE BASE (Single Source of Truth)
 * ==============================================================================
 * Central knowledge base consumed by the AI Portfolio Assistant and UI components.
 * Easily update profile details, projects, FiveM systems, skills, and contact data here.
 */
export const portfolioData: PortfolioKnowledge = {
  profile: {
    name: "Akalanka",
    headline: "Full Stack Engineer & Interactive Systems Architect",
    title: "Senior Full Stack & FiveM Game Systems Developer",
    location: "Global / Remote",
    experienceYears: 4,
    availability: "Available for freelance projects, custom web platforms, and FiveM game script development",
    status: "Active / Accepting Inquiries",
    bio: "Full Stack Engineer specializing in modern high-performance web applications (Next.js, React, Node.js, TypeScript), real-time systems, and advanced FiveM game script engineering (Lua, QB-Core, Qbox). Passionate about cinematic UI design, low-latency architectures, and deep interactive experiences.",
  },

  about: {
    summary:
      "Akalanka is an engineering-driven developer with an obsession for high-performance web systems and immersive game scripting. He combines rigorous software architecture with futuristic aesthetics, building robust web applications and intricate FiveM server gameplay ecosystems.",
    philosophy:
      "Engineering excellence lies at the intersection of precision logic, aesthetic mastery, and uncompromised performance. Every millisecond of latency saved is a victory.",
    specialties: [
      "Production Next.js & React Web Applications",
      "Full-Stack TypeScript & API Systems",
      "FiveM Advanced Gameplay Mechanics (QB-Core, Qbox, Lua)",
      "Real-time Telemetry & WebSockets",
      "High-Conversion UI/UX with Cybernetic & Glassmorphism Design",
      "Secure Server Infrastructure & Cloud Deployment",
    ],
    passion: "Crafting digital experiences that feel alive, futuristic, and technically flawless.",
  },

  education: [
    {
      degree: "Bachelor of Science in Information Technology / Software Engineering",
      institution: "Higher Education Institute",
      period: "Completed",
      details:
        "Focused on Object-Oriented Programming, Database Management Systems, Distributed Networks, Algorithm Design, and Web Architecture.",
    },
    {
      degree: "Advanced Web & Systems Engineering Certifications",
      institution: "Professional Technical Academies",
      period: "Continuous",
      details:
        "Specialized coursework in Modern React Patterns, Serverless Architectures, Cloud Networking, and Game Script Telemetry.",
    },
  ],

  experience: [
    {
      role: "Lead Full Stack & Interactive Systems Developer",
      company: "Freelance / DevCraft Studio",
      period: "2021 – Present",
      highlights: [
        "Architected and deployed 40+ client web applications including SaaS analytics engines, headless e-commerce platforms, and real-time GIS mapping portals.",
        "Engineered cybernetic, high-performance web experiences utilizing Next.js 14, Framer Motion, and WebGL with consistent 95+ Google Lighthouse scores.",
        "Built custom RESTful and WebSocket backends handling state synchronization, secure JWT authentication, and Stripe payment processing.",
      ],
    },
    {
      role: "Senior FiveM Game Systems Engineer",
      company: "Custom FiveM Roleplay Communities & Private Servers",
      period: "2021 – Present",
      highlights: [
        "Designed and scripted proprietary server frameworks and complex robbery/heist mechanics in Lua for QB-Core and Qbox ecosystems.",
        "Engineered physical interaction systems including heavy-vehicle chain pulling for physical ATM extractions, custom angle-grinder cutting minigames, and hacking exploits.",
        "Optimized client-side frame times from 1.2ms down to <0.04ms idle resmon through aggressive thread pooling, spatial caching, and event throttling.",
      ],
    },
  ],

  skills: {
    core: [
      "Full-Stack Web Development",
      "Interactive Game Scripting",
      "Real-time WebSocket Architectures",
      "Database Modeling & Optimization",
      "API Security & Rate Limiting",
      "Cybernetic UI/UX Engineering",
    ],
    architecture: [
      "Microservices & Serverless Next.js App Router",
      "Headless E-Commerce Integration",
      "Role-Based Access Control (RBAC)",
      "Spatial & Grid Coordinate Systems",
      "FiveM Client/Server State Replication",
    ],
    methodologies: [
      "Agile Development",
      "Test-Driven Development (TDD)",
      "Modular Component Architecture",
      "Continuous Integration & Deployment (CI/CD)",
    ],
  },

  programmingLanguages: [
    { name: "TypeScript", level: "Expert", context: "Full-stack web architecture, strict type contracts, Next.js, Node.js" },
    { name: "JavaScript (ES6+)", level: "Expert", context: "Client and server runtime logic, Web Audio API, Canvas" },
    { name: "Lua", level: "Expert", context: "FiveM game mechanics, server/client tick threads, Qbox and QB-Core scripts" },
    { name: "PHP", level: "Proficient", context: "Backend APIs, Laravel full-stack services, server scripting" },
    { name: "SQL", level: "Proficient", context: "PostgreSQL, MySQL, relational schema design, query optimization" },
    { name: "HTML5 & CSS3", level: "Expert", context: "Semantic layout, CSS Grid, Flexbox, custom animations, cybernetic effects" },
    { name: "Bash / Shell", level: "Proficient", context: "Linux server automation, cron jobs, FiveM optimization scripts" },
  ],

  frameworks: [
    { name: "Next.js (App Router & Pages)", type: "fullstack", context: "Production web applications, SSR, SSG, Route Handlers" },
    { name: "React 18+", type: "frontend", context: "Custom hook patterns, state management, interactive UIs" },
    { name: "Tailwind CSS", type: "styling", context: "Utility-first design systems, custom themes, cyber aesthetics" },
    { name: "Node.js & Express", type: "backend", context: "High-concurrency RESTful APIs, middleware pipelines" },
    { name: "Laravel", type: "backend", context: "Robust enterprise services, MVC architectures, Eloquent ORM" },
    { name: "Framer Motion", type: "styling", context: "Physics-based micro-interactions, layout transitions, HUD animations" },
  ],

  tools: [
    "Git & GitHub",
    "VS Code",
    "Docker",
    "Postman",
    "Figma",
    "Linux (Ubuntu/Debian Server)",
    "Nginx Reverse Proxy",
    "Cloudflare",
    "Mixkit / FFmpeg",
    "Vercel",
  ],

  databases: [
    { name: "PostgreSQL", type: "Relational SQL", usage: "High-integrity relational data, spatial indexing, complex queries" },
    { name: "MongoDB", type: "NoSQL Document", usage: "Document storage, rapid prototyping, dynamic schemaless records" },
    { name: "MySQL / MariaDB", type: "Relational SQL", usage: "FiveM server persistence, oxmysql, enterprise transactional storage" },
    { name: "Redis", type: "In-Memory Cache", usage: "Session management, fast rate limiting, pub/sub messaging" },
    { name: "Firebase / Firestore", type: "Real-time Cloud", usage: "Real-time subscriptions, serverless telemetry, rapid client prototypes" },
  ],

  webDevelopment: {
    focus: "Ultra-fast, responsive, secure full-stack applications with futuristic aesthetics and modern developer experience.",
    capabilities: [
      "Next.js 14 App Router full-stack architecture with server actions and route handlers",
      "Cybernetic and glassmorphism UI design with customized theme tokens",
      "Stripe payment gateway integration with webhooks and multi-currency billing",
      "Dynamic data visualization using Chart.js, Recharts, and WebGL Canvas",
      "Server-side authentication with JWT, OAuth, and role-based permissions",
      "Performance optimization achieving sub-second initial load and 99+ PageSpeed ratings",
    ],
  },

  gameDevelopment: {
    focus: "Multiplayer networked simulation, immersive game mechanics, and performance-critical client-side script optimization.",
    capabilities: [
      "Real-time client/server state synchronization and anti-cheat validation",
      "Physical prop attachment, animation blending, and entity manipulation",
      "Custom NUI (Web-based user interfaces inside games using HTML/JS/CSS)",
      "Spatial audio triggers and particle/visual effects synchronization",
    ],
  },

  fiveMDevelopment: {
    focus: "Advanced custom mechanics, heist ecosystems, vehicle handling, and low-resmon server optimizations.",
    frameworks: ["QB-Core", "Qbox (QBX)", "ESX Legacy", "ox_core", "ox_lib", "oxmysql"],
    capabilities: [
      "Custom multi-stage heist scripts (bank vaults, jewelry stores, security depots)",
      "Chain-pulling physics: Backing heavy trucks up to ATMs, attaching heavy chains, ripping props from ground, and transport",
      "Hacking and minigame systems: Laptop decrypters, drilling minigames, laser wire bypasses, explosive charges",
      "Bank robbery locations: Sandy Shores bank & shop, Grapeseed, Paleto bank & warehouse hideouts",
      "Resource monitor (resmon) optimization: Reducing tick rates to <0.04ms",
      "Custom item exploits & inventory management integration (ox_inventory / qb-inventory)",
    ],
    customSystems: [
      "Physical ATM Chain-Ripping Heist System",
      "Drill & Laptop Electronic Exploit Terminal",
      "High-Yield Security Transport Ambush System",
      "FiveM Server OS Optimization Suite",
    ],
  },

  cloudNetworking: {
    focus: "Reliable Linux VPS hosting, DDoS protection, edge routing, and continuous delivery.",
    capabilities: [
      "Linux server hardening (UFW firewall, SSH key access, non-root daemons)",
      "Nginx reverse proxy configuration with WebSocket support and HTTP/2",
      "Cloudflare DNS, caching rules, and DDoS rate-limiting rules",
      "Automated system health monitors, cron jobs, and backup pipelines",
    ],
  },

  projects: [
    {
      id: "saas-analytics",
      title: "SaaS Analytics Cloud Platform",
      category: "SaaS & Cloud Telemetry",
      description:
        "Enterprise real-time analytics engine with interactive time-series telemetry charts, JWT role-based access control, and dark mode glass UI.",
      techStack: ["TypeScript", "Next.js 14", "Tailwind CSS", "PostgreSQL", "Prisma", "Chart.js"],
      highlights: [
        "Interactive time-series telemetry with microsecond precision",
        "JWT role-based access control (RBAC)",
        "Dark mode glassmorphism UI with custom cyber tokens",
      ],
      liveUrl: "https://example.com/saas-platform",
      githubUrl: "https://github.com/example/saas-platform",
    },
    {
      id: "ecommerce-matrix",
      title: "High-Conversion E-Commerce Matrix",
      category: "Headless E-Commerce",
      description:
        "Modern headless digital store featuring instant Stripe checkout, dynamic inventory synchronization, multi-currency support, and 99 PageSpeed.",
      techStack: ["React", "Next.js", "Node.js", "Stripe API", "MongoDB", "Tailwind CSS", "Redis"],
      highlights: [
        "Headless Stripe checkout pipeline with zero-friction cart",
        "Dynamic multi-currency and real-time inventory sync",
        "99 Google Lighthouse PageSpeed rating",
      ],
      liveUrl: "https://example.com/ecommerce-matrix",
      githubUrl: "https://github.com/example/ecommerce-matrix",
    },
    {
      id: "agency-landing",
      title: "Agency Landing & 3D Interactive Hub",
      category: "Interactive 3D & WebGL",
      description:
        "Award-winning marketing portal with smooth scroll canvas shader animations, glassmorphism UI, and 99 Lighthouse performance rating.",
      techStack: ["Next.js", "Framer Motion", "WebGL Canvas", "TypeScript", "Tailwind CSS"],
      highlights: [
        "61-frame cybernetic scroll canvas engine",
        "Smooth scroll physics and responsive shader overlays",
        "Lighthouse performance rating of 99",
      ],
      liveUrl: "https://example.com/agency-landing",
      githubUrl: "https://github.com/example/agency-landing",
    },
    {
      id: "real-estate-gis",
      title: "Real Estate GIS Portal",
      category: "GIS & Spatial Web Apps",
      description:
        "Interactive property portal with map coordinates, spatial filtering, virtual tour player, and automated agent lead routing.",
      techStack: ["Next.js 14", "Mapbox GL", "PostGIS", "PostgreSQL", "Tailwind CSS"],
      highlights: [
        "Interactive spatial property maps with coordinate filtering",
        "Integrated virtual 360 tour viewer",
        "Automated lead routing and notification transmission system",
      ],
      liveUrl: "https://example.com/realestate-portal",
      githubUrl: "https://github.com/example/realestate-portal",
    },
    {
      id: "fivem-atm-heist",
      title: "FiveM Chain-Pulling ATM Heist System",
      category: "Game Systems & Multiplayer Lua",
      description:
        "Physics-based immersive robbery system for Qbox and QB-Core where players attach heavy truck chains to ATMs, rip them from foundations, and cut them open at safehouses.",
      techStack: ["Lua", "Qbox", "QB-Core", "ox_lib", "ox_inventory", "FiveM Native APIs"],
      highlights: [
        "Dynamic rope and chain physics synchronized across all networked clients",
        "Synchronized prop destruction and police dispatcher alert triggers",
        "Angle grinder cut minigame with spark particles and cutting progress",
        "Resource monitor optimization running at 0.01ms idle",
      ],
    },
  ],

  achievements: [
    "Delivered 40+ production web solutions and client installations with 100% satisfaction",
    "Engineered game scripts serving hundreds of concurrent players on high-population FiveM servers",
    "Maintained sub-0.04ms execution benchmarks across mission-critical game server loops",
    "Engineered full cybernetic design system with custom HUD controls and Web Audio visualizers",
  ],

  links: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    fiverr: "#contact",
    website: "https://devcraft-agency.com",
  },

  contact: {
    email: "contact@akalanka.dev",
    discord: "Akalanka#0001",
    preferredMethod: "Portfolio contact form or direct email for project bookings and technical inquiries.",
    availability: "Available for new projects, custom full-stack web engineering, and FiveM system development.",
  },
};

/**
 * ==============================================================================
 * BACKWARD COMPATIBILITY EXPORT
 * ==============================================================================
 * Preserved for components/sections/Portfolio.tsx and lib/store.ts
 */
export const portfolioProjectsData: PortfolioProject[] = [
  {
    id: "saas-analytics",
    title: "SaaS Analytics Cloud Platform",
    category: "saas",
    type: "saas",
    description:
      "Enterprise real-time analytics engine with interactive time-series telemetry charts, JWT role-based access control, and dark mode glass UI.",
    languages: ["TypeScript", "Next.js 14", "Tailwind CSS", "PostgreSQL", "Prisma"],
    tags: ["React", "Node.js", "MongoDB", "Chart.js"],
    gradient: "linear-gradient(135deg, rgba(220, 38, 38, 0.25) 0%, rgba(14, 10, 24, 0.9) 100%)",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-cyber-security-holographic-interface-41551-large.mp4",
    client: "Apex Metrics Global",
  },
  {
    id: "ecommerce-store",
    title: "High-Conversion E-Commerce Matrix",
    category: "ecommerce",
    type: "ecommerce",
    description:
      "Modern headless digital store featuring instant Stripe checkout, dynamic inventory synchronization, multi-currency support, and 99 PageSpeed.",
    languages: ["React", "Node.js", "Stripe API", "MongoDB", "Tailwind CSS"],
    tags: ["Next.js", "Laravel", "PostgreSQL", "Stripe"],
    gradient: "linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(18, 12, 28, 0.9) 100%)",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    client: "Vogue Dynamics",
  },
  {
    id: "agency-landing",
    title: "Agency Landing & 3D Interactive Hub",
    category: "landing",
    type: "landing",
    description:
      "Award-winning marketing portal with smooth scroll canvas shader animations, glassmorphism UI, and 99 Lighthouse performance rating.",
    languages: ["Next.js", "Framer Motion", "WebGL Canvas", "TypeScript"],
    tags: ["Next.js", "Tailwind", "Framer Motion"],
    gradient: "linear-gradient(135deg, rgba(185, 28, 28, 0.25) 0%, rgba(10, 8, 18, 0.9) 100%)",
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
    client: "Neural Media Group",
  },
  {
    id: "real-estate",
    title: "Real Estate GIS Portal",
    category: "realestate",
    type: "realestate",
    description:
      "Interactive property portal with map coordinates, spatial filtering, virtual tour player, and automated agent lead routing.",
    languages: ["Next.js 14", "Mapbox GL", "PostGIS", "Tailwind CSS"],
    tags: ["React", "Express.js", "MongoDB", "Mapbox"],
    gradient: "linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(12, 8, 22, 0.9) 100%)",
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop",
    client: "Horizon Real Estate",
  },
];
