export interface NavLink {
  label: string;
  href: string;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

export interface FloatingCardData {
  icon: string;
  label: string;
  value: string;
  className: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  tag: string;
  iconName: string;
}

export interface TechItem {
  name: string;
  iconSvg?: string;
  color?: string;
}

export interface TechCategory {
  title: string;
  items: TechItem[];
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface PackageFeature {
  text: string;
  included: boolean;
}

export interface PricingPackage {
  id: string;
  tier: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  features: PackageFeature[];
  delivery: string;
  isFeatured?: boolean;
  badge?: string;
  ctaText: string;
}

export interface DeployedArchitecture {
  id: string;
  title: string;
  category?: "saas" | "ecommerce" | "landing" | "realestate" | "webapp" | "ai" | "mobile" | string;
  description: string;
  languages?: string[];
  tags: string[];
  gradient: string;
  imageUrl?: string;
  videoUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  client?: string;
  completionDate?: string;
  type?: "saas" | "ecommerce" | "landing" | "realestate" | string;
}

export type PortfolioProject = DeployedArchitecture;

export interface Testimonial {
  id: string;
  rating: number;
  text: string;
  author: string;
  role: string;
  avatarBg: string;
  initials: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ContactHighlight {
  icon: string;
  text: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
}

export interface TransmissionMessage {
  id: string;
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
  status: "unread" | "read" | "replied" | "archived";
  createdAt: string;
  ip?: string;
  location?: string;
  countryCode?: string;
}

export interface VisitorLog {
  id: string;
  ip: string;
  city: string;
  country: string;
  countryCode: string;
  flag: string;
  browser: string;
  os: string;
  device: "Desktop" | "Mobile" | "Tablet";
  page: string;
  referrer: string;
  timestamp: string;
}

export interface AnalyticsGrowthPoint {
  date: string;
  visitors: number;
  pageviews: number;
  transmissions: number;
}

export interface SiteProfileSettings {
  developerName: string;
  title: string;
  headlineName1: string;
  headlineName2: string;
  subtitle: string;
  bio: string;
  availableForFreelance: boolean;
  availableWorldwide: boolean;
  experienceYears: number;
  projectsCompleted: number;
  happyClients: number;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  fiverrUrl: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  author: string;
  keywords: string[];
  ogImage: string;
  url: string;
  links: {
    github: string;
    linkedin: string;
    twitter: string;
    fiverr: string;
  };
}
