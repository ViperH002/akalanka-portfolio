import { ServiceItem } from "@/types";

export const servicesData: ServiceItem[] = [
  {
    id: "responsive-design",
    title: "Responsive Design",
    description: "Pixel-perfect interfaces that look flawless on every device — mobile, tablet, and desktop.",
    tag: "Frontend",
    iconName: "MonitorSmartphone",
  },
  {
    id: "full-stack-dev",
    title: "Full Stack Development",
    description: "End-to-end solutions with robust backends, RESTful APIs, and scalable database architecture.",
    tag: "Backend",
    iconName: "Code2",
  },
  {
    id: "secure-auth",
    title: "Secure Authentication",
    description: "JWT, OAuth 2.0, Firebase Auth — multi-layer security with role-based access control.",
    tag: "Security",
    iconName: "ShieldCheck",
  },
  {
    id: "payment-integration",
    title: "Payment Integration",
    description: "Stripe, PayPal, and custom payment flows — seamless checkout experiences that convert.",
    tag: "E-Commerce",
    iconName: "CreditCard",
  },
  {
    id: "seo-optimization",
    title: "SEO Optimization",
    description: "Semantic HTML, meta tags, structured data, Core Web Vitals — built to rank on Google.",
    tag: "Growth",
    iconName: "SearchCheck",
  },
  {
    id: "cloud-deployment",
    title: "Cloud Deployment",
    description: "Vercel, Netlify, VPS — CI/CD pipelines, SSL, and production-grade deployment.",
    tag: "DevOps",
    iconName: "CloudCog",
  },
];
