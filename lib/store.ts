"use client";

import { useSyncExternalStore, useEffect } from "react";
import {
  PricingPackage,
  DeployedArchitecture,
  TransmissionMessage,
  VisitorLog,
  AnalyticsGrowthPoint,
  SiteProfileSettings,
} from "@/types";
import { packagesData as defaultPackages } from "@/data/packages";

const STORAGE_KEYS = {
  PACKAGES: "devcraft_admin_packages_v1",
  PROJECTS: "devcraft_admin_projects_v1",
  TRANSMISSIONS: "devcraft_admin_transmissions_v1",
  VISITOR_LOGS: "devcraft_admin_visitor_logs_v1",
  ANALYTICS: "devcraft_admin_analytics_v1",
  SETTINGS: "devcraft_admin_settings_v1",
};

// Default seed projects
const defaultArchitectures: DeployedArchitecture[] = [
  {
    id: "proj-1",
    title: "SaaS Analytics Cloud Platform",
    category: "saas",
    type: "saas",
    description:
      "Enterprise real-time analytics engine with interactive time-series telemetry charts, JWT role-based access control, and dark mode glass UI.",
    languages: ["TypeScript", "Next.js 14", "Tailwind CSS", "PostgreSQL", "Prisma"],
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Recharts", "Prisma"],
    gradient: "linear-gradient(135deg, rgba(220, 38, 38, 0.25) 0%, rgba(14, 10, 24, 0.9) 100%)",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-cyber-security-holographic-interface-41551-large.mp4",
    liveUrl: "https://example.com/saas-platform",
    githubUrl: "https://github.com/example/saas-platform",
    client: "Apex Metrics Global",
    completionDate: "2026-04-12",
  },
  {
    id: "proj-2",
    title: "High-Conversion E-Commerce Matrix",
    category: "ecommerce",
    type: "ecommerce",
    description:
      "Modern headless digital store featuring instant Stripe checkout, dynamic inventory synchronization, multi-currency support, and 99 PageSpeed.",
    languages: ["React", "Node.js", "Stripe API", "MongoDB", "Tailwind CSS"],
    tags: ["React", "Node.js", "Stripe API", "MongoDB", "Redis"],
    gradient: "linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(18, 12, 28, 0.9) 100%)",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    liveUrl: "https://example.com/ecommerce-matrix",
    githubUrl: "https://github.com/example/ecommerce-matrix",
    client: "Vogue Dynamics",
    completionDate: "2026-05-20",
  },
  {
    id: "proj-3",
    title: "Agency Landing & 3D Interactive Hub",
    category: "landing",
    type: "landing",
    description:
      "Award-winning marketing portal with smooth scroll canvas shader animations, glassmorphism UI, and 99 Lighthouse performance rating.",
    languages: ["Next.js", "Framer Motion", "WebGL Canvas", "TypeScript"],
    tags: ["Next.js", "Framer Motion", "Tailwind CSS", "Canvas"],
    gradient: "linear-gradient(135deg, rgba(185, 28, 28, 0.25) 0%, rgba(10, 8, 18, 0.9) 100%)",
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
    liveUrl: "https://example.com/agency-landing",
    githubUrl: "https://github.com/example/agency-landing",
    client: "Neural Media Group",
    completionDate: "2026-06-08",
  },
  {
    id: "proj-4",
    title: "Real Estate GIS Portal",
    category: "realestate",
    type: "realestate",
    description:
      "Interactive property portal with map coordinates, spatial filtering, virtual tour player, and automated agent lead routing.",
    languages: ["Next.js 14", "Mapbox GL", "PostGIS", "Tailwind CSS"],
    tags: ["Next.js", "Mapbox GL", "PostgreSQL", "Node.js"],
    gradient: "linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(12, 8, 22, 0.9) 100%)",
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop",
    liveUrl: "https://example.com/realestate-portal",
    githubUrl: "https://github.com/example/realestate-portal",
    client: "Horizon Real Estate",
    completionDate: "2026-07-15",
  },
];

// Default seed transmissions inbox
const defaultTransmissions: TransmissionMessage[] = [
  {
    id: "msg-101",
    name: "Alexander Vance",
    email: "alex.vance@nexus-core.io",
    projectType: "Cloud SaaS Application",
    budget: "$2,500+ (Custom Scalable Deployment)",
    message:
      "We need a full-scale digital dashboard with real-time WebSocket telemetry, Stripe billing, and responsive mobile apps. Timeline is 4 weeks.",
    status: "unread",
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    ip: "198.51.100.42",
    location: "San Francisco, United States",
    countryCode: "US",
  },
  {
    id: "msg-102",
    name: "Sophia Hartmann",
    email: "s.hartmann@berlin-tech.de",
    projectType: "High-Conversion E-Commerce",
    budget: "$1,000 – $2,500 (Enterprise Tier)",
    message:
      "Looking to migrate our luxury fashion store from Shopify to a custom Next.js 14 headless solution with 3D product previews.",
    status: "read",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    ip: "84.115.201.78",
    location: "Berlin, Germany",
    countryCode: "DE",
  },
  {
    id: "msg-103",
    name: "Kenji Sato",
    email: "kenji@tokyo-ai-labs.jp",
    projectType: "Custom Scalable System",
    budget: "$2,500+ (Custom Scalable Deployment)",
    message:
      "Need cybernetic UI design and full stack development for our LLM orchestration web platform. Must have dark glass aesthetic.",
    status: "replied",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    ip: "133.242.18.91",
    location: "Tokyo, Japan",
    countryCode: "JP",
  },
];

// Default seed visitor telemetry logs
const defaultVisitorLogs: VisitorLog[] = [
  {
    id: "log-1",
    ip: "198.51.100.42",
    city: "San Francisco",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    browser: "Chrome 124",
    os: "macOS Sonoma",
    device: "Desktop",
    page: "/#hero",
    referrer: "Direct Transmission",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: "log-2",
    ip: "84.115.201.78",
    city: "Berlin",
    country: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
    browser: "Firefox 125",
    os: "Windows 11",
    device: "Desktop",
    page: "/#packages",
    referrer: "https://linkedin.com",
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: "log-3",
    ip: "133.242.18.91",
    city: "Tokyo",
    country: "Japan",
    countryCode: "JP",
    flag: "🇯🇵",
    browser: "Safari 17",
    os: "iOS 17.4",
    device: "Mobile",
    page: "/#portfolio",
    referrer: "https://twitter.com",
    timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
  },
  {
    id: "log-4",
    ip: "185.120.76.12",
    city: "London",
    country: "United Kingdom",
    countryCode: "GB",
    flag: "🇬🇧",
    browser: "Edge 124",
    os: "Windows 11",
    device: "Desktop",
    page: "/#contact",
    referrer: "https://github.com",
    timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
  },
  {
    id: "log-5",
    ip: "103.14.120.55",
    city: "Singapore",
    country: "Singapore",
    countryCode: "SG",
    flag: "🇸🇬",
    browser: "Chrome 124",
    os: "Android 14",
    device: "Mobile",
    page: "/#tech",
    referrer: "Google Search",
    timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
  },
  {
    id: "log-6",
    ip: "186.215.90.33",
    city: "São Paulo",
    country: "Brazil",
    countryCode: "BR",
    flag: "🇧🇷",
    browser: "Chrome 124",
    os: "macOS",
    device: "Desktop",
    page: "/#services",
    referrer: "Direct",
    timestamp: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
  },
];

// Default seed growth data points
const defaultGrowthData: AnalyticsGrowthPoint[] = [
  { date: "Day 1", visitors: 420, pageviews: 1150, transmissions: 4 },
  { date: "Day 2", visitors: 580, pageviews: 1480, transmissions: 7 },
  { date: "Day 3", visitors: 690, pageviews: 1920, transmissions: 9 },
  { date: "Day 4", visitors: 810, pageviews: 2340, transmissions: 12 },
  { date: "Day 5", visitors: 940, pageviews: 2890, transmissions: 16 },
  { date: "Day 6", visitors: 1120, pageviews: 3410, transmissions: 21 },
  { date: "Today", visitors: 1380, pageviews: 4120, transmissions: 28 },
];

// Default site profile settings
const defaultSettings: SiteProfileSettings = {
  developerName: "Akalanka Egodawatte",
  title: "Akalanka Portfolio",
  headlineName1: "AKALANKA",
  headlineName2: "EGODAWATTE",
  subtitle: "WEB DESIGNER & UI/UX CREATOR",
  bio: "Full Stack Engineer & Interactive Systems Architect specializing in modern high-performance web applications, real-time systems, and advanced game script engineering.",
  availableForFreelance: true,
  availableWorldwide: true,
  experienceYears: 4,
  projectsCompleted: 40,
  happyClients: 20,
  githubUrl: "https://github.com/ViperH002",
  linkedinUrl: "https://linkedin.com",
  twitterUrl: "https://twitter.com",
  fiverrUrl: "#contact",
};

interface StoreState {
  isLoaded: boolean;
  packages: PricingPackage[];
  projects: DeployedArchitecture[];
  transmissions: TransmissionMessage[];
  visitorLogs: VisitorLog[];
  growthData: AnalyticsGrowthPoint[];
  settings: SiteProfileSettings;
}

// Initial In-Memory State
let currentState: StoreState = {
  isLoaded: false,
  packages: defaultPackages,
  projects: defaultArchitectures,
  transmissions: defaultTransmissions,
  visitorLogs: defaultVisitorLogs,
  growthData: defaultGrowthData,
  settings: defaultSettings,
};

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => {
    listener();
  });
}

// Client-side single initialization
let initialized = false;
function initializeStoreOnce() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  try {
    const savedPackages = localStorage.getItem(STORAGE_KEYS.PACKAGES);
    const savedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    const savedTransmissions = localStorage.getItem(STORAGE_KEYS.TRANSMISSIONS);
    const savedLogs = localStorage.getItem(STORAGE_KEYS.VISITOR_LOGS);
    const savedAnalytics = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);

    let initialSettings = savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    // Auto-migrate legacy name if previously cached in user browser localStorage
    if (
      initialSettings.headlineName1 === "RAYHAN" ||
      initialSettings.headlineName2 === "ADITYA" ||
      initialSettings.developerName === "Rayhan Aditya"
    ) {
      initialSettings = {
        ...initialSettings,
        headlineName1: "AKALANKA",
        headlineName2: "EGODAWATTE",
        developerName: "Akalanka Egodawatte",
        title: "Akalanka Portfolio",
      };
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialSettings));
      } catch {}
    }

    currentState = {
      isLoaded: true,
      packages: savedPackages ? JSON.parse(savedPackages) : defaultPackages,
      projects: savedProjects ? JSON.parse(savedProjects) : defaultArchitectures,
      transmissions: savedTransmissions ? JSON.parse(savedTransmissions) : defaultTransmissions,
      visitorLogs: savedLogs ? JSON.parse(savedLogs) : defaultVisitorLogs,
      growthData: savedAnalytics ? JSON.parse(savedAnalytics) : defaultGrowthData,
      settings: initialSettings,
    };
    emitChange();
  } catch (e) {
    console.error("[STORE] Failed to read from localStorage:", e);
    currentState = { ...currentState, isLoaded: true };
    emitChange();
  }
}

function updateState(partial: Partial<StoreState>) {
  currentState = { ...currentState, ...partial };
  emitChange();
}

/**
 * Singleton Reactive Store Hook powered by React 18 useSyncExternalStore
 */
export function useAppStore() {
  useEffect(() => {
    initializeStoreOnce();
  }, []);

  const state = useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange);
      return () => {
        listeners.delete(onStoreChange);
      };
    },
    () => currentState,
    () => ({
      isLoaded: false,
      packages: defaultPackages,
      projects: defaultArchitectures,
      transmissions: defaultTransmissions,
      visitorLogs: defaultVisitorLogs,
      growthData: defaultGrowthData,
      settings: defaultSettings,
    })
  );

  // --- Package Actions ---
  const savePackages = (newPackages: PricingPackage[]) => {
    updateState({ packages: newPackages });
    try {
      localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(newPackages));
    } catch (e) {
      console.error(e);
    }
  };

  const addPackage = (pkg: Omit<PricingPackage, "id">) => {
    const newPkg: PricingPackage = { ...pkg, id: `pkg-${Date.now()}` };
    savePackages([...state.packages, newPkg]);
  };

  const updatePackage = (id: string, updatedFields: Partial<PricingPackage>) => {
    savePackages(state.packages.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)));
  };

  const deletePackage = (id: string) => {
    savePackages(state.packages.filter((p) => p.id !== id));
  };

  // --- Project Actions ---
  const saveProjects = (newProjects: DeployedArchitecture[]) => {
    updateState({ projects: newProjects });
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(newProjects));
    } catch (e) {
      console.error(e);
    }
  };

  const addProject = (proj: Omit<DeployedArchitecture, "id">) => {
    const newProj: DeployedArchitecture = {
      ...proj,
      id: `proj-${Date.now()}`,
      type: proj.category as any,
    };
    saveProjects([newProj, ...state.projects]);
  };

  const updateProject = (id: string, updatedFields: Partial<DeployedArchitecture>) => {
    saveProjects(state.projects.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)));
  };

  const deleteProject = (id: string) => {
    saveProjects(state.projects.filter((p) => p.id !== id));
  };

  // --- Transmission Actions ---
  const saveTransmissions = (newMsgs: TransmissionMessage[]) => {
    updateState({ transmissions: newMsgs });
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSMISSIONS, JSON.stringify(newMsgs));
    } catch (e) {
      console.error(e);
    }
  };

  const addTransmission = (data: {
    name: string;
    email: string;
    projectType: string;
    budget: string;
    message: string;
  }) => {
    const newMsg: TransmissionMessage = {
      id: `msg-${Date.now()}`,
      ...data,
      status: "unread",
      createdAt: new Date().toISOString(),
      ip: "64.233.160.1",
      location: "Active Client Transmission",
      countryCode: "US",
    };
    saveTransmissions([newMsg, ...state.transmissions]);
  };

  const updateTransmissionStatus = (id: string, status: TransmissionMessage["status"]) => {
    saveTransmissions(state.transmissions.map((m) => (m.id === id ? { ...m, status } : m)));
  };

  const deleteTransmission = (id: string) => {
    saveTransmissions(state.transmissions.filter((m) => m.id !== id));
  };

  // --- Visitor Telemetry Log Action ---
  const logVisitor = (log: Omit<VisitorLog, "id" | "timestamp">) => {
    const newLog: VisitorLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    const updated = [newLog, ...state.visitorLogs.slice(0, 49)];
    updateState({ visitorLogs: updated });
    try {
      localStorage.setItem(STORAGE_KEYS.VISITOR_LOGS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // --- Settings Actions ---
  const updateSettings = (newSettings: Partial<SiteProfileSettings>) => {
    const updated = { ...state.settings, ...newSettings };
    updateState({ settings: updated });
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const resetToDefaults = () => {
    currentState = {
      isLoaded: true,
      packages: defaultPackages,
      projects: defaultArchitectures,
      transmissions: defaultTransmissions,
      visitorLogs: defaultVisitorLogs,
      growthData: defaultGrowthData,
      settings: defaultSettings,
    };
    try {
      localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(defaultPackages));
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(defaultArchitectures));
      localStorage.setItem(STORAGE_KEYS.TRANSMISSIONS, JSON.stringify(defaultTransmissions));
      localStorage.setItem(STORAGE_KEYS.VISITOR_LOGS, JSON.stringify(defaultVisitorLogs));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
    } catch (e) {
      console.error(e);
    }
    emitChange();
  };

  return {
    isLoaded: state.isLoaded,
    packages: state.packages,
    projects: state.projects,
    transmissions: state.transmissions,
    visitorLogs: state.visitorLogs,
    growthData: state.growthData,
    settings: state.settings,
    addPackage,
    updatePackage,
    deletePackage,
    addProject,
    updateProject,
    deleteProject,
    addTransmission,
    updateTransmissionStatus,
    deleteTransmission,
    logVisitor,
    updateSettings,
    resetToDefaults,
  };
}
