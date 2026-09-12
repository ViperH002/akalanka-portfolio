import React from "react";

export interface TechIconProps {
  className?: string;
}

// 1. Figma Logo (5 iconic colored geometric shapes)
export const FigmaIcon: React.FC<TechIconProps> = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
    <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
    <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
    <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
    <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
  </svg>
);

// 2. GitHub Logo (Octocat silhouette in white circle)
export const GitHubIcon: React.FC<TechIconProps> = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill="white" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      fill="#121217"
    />
  </svg>
);

// 3. Hero Isometric 3D Cubes (Featured Center Tile)
export const IsometricCubesIcon: React.FC<TechIconProps> = ({ className = "w-11 h-11" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(32, 32)">
      {/* Top central cube */}
      <polygon points="0,-16 10,-10 0,-4 -10,-10" fill="#FFFFFF" />
      <polygon points="0,-4 10,-10 10,2 0,8" fill="#E2D9FF" />
      <polygon points="-10,-10 0,-4 0,8 -10,2" fill="#B39DFF" />

      {/* Right lower cube */}
      <polygon points="12,-4 22,2 12,8 2,2" fill="#FFFFFF" opacity="0.95" />
      <polygon points="12,8 22,2 22,14 12,20" fill="#E2D9FF" />
      <polygon points="2,2 12,8 12,20 2,14" fill="#B39DFF" />

      {/* Left lower cube */}
      <polygon points="-12,-4 -2,2 -12,8 -22,2" fill="#FFFFFF" opacity="0.95" />
      <polygon points="-12,8 -2,2 -2,14 -12,20" fill="#E2D9FF" />
      <polygon points="-22,2 -12,8 -12,20 -22,14" fill="#B39DFF" />

      {/* Front bottom cube */}
      <polygon points="0,8 10,14 0,20 -10,14" fill="#FFFFFF" />
      <polygon points="0,20 10,14 10,26 0,32" fill="#E2D9FF" />
      <polygon points="-10,14 0,20 0,32 -10,26" fill="#B39DFF" />
    </g>
  </svg>
);

// 4. Terminal $| CLI Logo (Neon green prompt)
export const TerminalCLIIcon: React.FC<TechIconProps> = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text
      x="10"
      y="33"
      fill="#22C55E"
      fontFamily="monospace"
      fontSize="26"
      fontWeight="900"
      letterSpacing="-1"
    >
      $|
    </text>
  </svg>
);

// 5. SDK Hexagon Wireframe Logo
export const SDKHexIcon: React.FC<TechIconProps> = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon
      points="24,6 40,15 40,33 24,42 8,33 8,15"
      stroke="#A855F7"
      strokeWidth="2.5"
      strokeLinejoin="round"
      fill="rgba(168, 85, 247, 0.12)"
    />
    <path d="M24 6V24M40 33L24 24M8 33L24 24" stroke="#A855F7" strokeWidth="1.5" opacity="0.6" />
    <text
      x="24"
      y="27"
      textAnchor="middle"
      fill="#FFFFFF"
      fontFamily="sans-serif"
      fontSize="9"
      fontWeight="800"
      letterSpacing="0.5"
    >
      SDK
    </text>
  </svg>
);

// 6. GitLab Logo (Geometric Orange Fox)
export const GitLabIcon: React.FC<TechIconProps> = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 380 380" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M190 357.77L254.49 159.27H125.51L190 357.77Z" fill="#E24329"/>
    <path d="M190 357.77L125.51 159.27H22.79L190 357.77Z" fill="#FC6D26"/>
    <path d="M22.79 159.27L3.63 218.23C1.65 224.33 3.82 231.02 9.07 234.84L190 357.77L22.79 159.27Z" fill="#FCA326"/>
    <path d="M22.79 159.27H125.51L85.73 36.85C83.47 29.89 73.57 29.89 71.31 36.85L22.79 159.27Z" fill="#E24329"/>
    <path d="M190 357.77L254.49 159.27H357.21L190 357.77Z" fill="#FC6D26"/>
    <path d="M357.21 159.27L376.37 218.23C378.35 224.33 376.18 231.02 370.93 234.84L190 357.77L357.21 159.27Z" fill="#FCA326"/>
    <path d="M357.21 159.27H254.49L294.27 36.85C296.53 29.89 306.43 29.89 308.69 36.85L357.21 159.27Z" fill="#E24329"/>
  </svg>
);

// 7. Microsoft Azure Logo (Stylized Blue "A")
export const AzureIcon: React.FC<TechIconProps> = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M53.64 12L24 64.68H51.24L58.92 84H72L53.64 12Z" fill="#008AD7"/>
    <path d="M24 64.68L40.2 36.36L53.64 64.68H24Z" fill="#0078D4"/>
    <path d="M40.2 36.36L53.64 12L72 84H58.92L51.24 64.68H24L40.2 36.36Z" fill="#50E6FF" opacity="0.4"/>
  </svg>
);

// 8. Next.js Logo (Modern monochrome badge)
export const NextjsIcon: React.FC<TechIconProps> = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="90" cy="90" r="85" fill="#000000" stroke="#444444" strokeWidth="2" />
    <path
      d="M149.508 157.52L69.142 54H54V125.97H66.602V71.745L138.868 164.715C142.616 162.593 146.182 160.181 149.508 157.52Z"
      fill="url(#nextjs_paint0)"
    />
    <rect x="115" y="54" width="12.5" height="72" fill="url(#nextjs_paint1)" />
    <defs>
      <linearGradient id="nextjs_paint0" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="nextjs_paint1" x1="121.25" y1="54" x2="121.25" y2="126" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0.15" />
      </linearGradient>
    </defs>
  </svg>
);

// 9. React Logo (Cyan Atom)
export const ReactIcon: React.FC<TechIconProps> = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="-11.5 -10.23174 23 20.46348" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
    <g stroke="#61DAFB" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>
);

// 10. TypeScript Logo
export const TypeScriptIcon: React.FC<TechIconProps> = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="128" height="128" rx="20" fill="#3178C6" />
    <path d="M70.65 97.41c2.19 1.43 5.48 2.62 9.09 2.62 9.69 0 15.65-5.32 15.65-14.28 0-8.54-5.24-13.12-14.81-16.92-6.19-2.48-8.81-5.12-8.81-9.28 0-4.48 3.76-7.85 9.76-7.85 3.52 0 6.43.95 8.09 1.9l2.48-6.95c-2-1.19-5.19-2.1-9.33-2.1-10.43 0-16.95 6.09-16.95 14.52 0 7.81 4.76 12.66 13.9 16.38 6.48 2.57 9.86 5.33 9.86 9.9 0 4.9-4.19 8.28-10.66 8.28-4.38 0-8.19-1.43-10.28-2.67l-2.99 6.45zM44.42 54.34h12.57V100h-9.14V62.43H36.33v-8.09h8.09z" fill="#FFFFFF" />
  </svg>
);

// 11. Tailwind CSS Logo
export const TailwindIcon: React.FC<TechIconProps> = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 54 33" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"
      fill="#06B6D4"
    />
  </svg>
);

// 12. Node.js Logo
export const NodejsIcon: React.FC<TechIconProps> = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 2.5L3.87 9.5v14.01L16 30.5l12.13-6.99V9.5L16 2.5z"
      fill="#339933"
    />
    <path
      d="M16 4.3L5.43 10.4v12.21L16 28.7l10.57-6.09V10.4L16 4.3z"
      fill="#5FA04E"
    />
    <path
      d="M16 12.5c-2.4 0-4.3 1.9-4.3 4.3s1.9 4.3 4.3 4.3 4.3-1.9 4.3-4.3-1.9-4.3-4.3-4.3zm0 6.5c-1.2 0-2.2-1-2.2-2.2s1-2.2 2.2-2.2 2.2 1 2.2 2.2-1 2.2-2.2 2.2z"
      fill="#FFFFFF"
    />
  </svg>
);

// 13. PostgreSQL Logo
export const PostgreSQLIcon: React.FC<TechIconProps> = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="20" fill="#336791" />
    <path
      d="M24 10c-7.7 0-14 5.8-14 13 0 4.1 2 7.7 5.2 10.1.3-1.2.9-2.3 1.8-3.1-.6-.8-1-1.8-1-2.9 0-2.8 2.2-5.1 5-5.1s5 2.3 5 5.1c0 1.1-.4 2.1-1 2.9.9.8 1.5 1.9 1.8 3.1 3.2-2.4 5.2-6 5.2-10.1 0-7.2-6.3-13-14-13z"
      fill="#FFFFFF"
    />
  </svg>
);

// 14. MongoDB Logo
export const MongoDBIcon: React.FC<TechIconProps> = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 1.5c-.3 0-.6.2-.7.4C10.1 4.3 6 10.8 6 15.3c0 4.2 3.1 7.2 6 7.2s6-3 6-7.2c0-4.5-4.1-11-5.3-13.4-.1-.2-.4-.4-.7-.4z"
      fill="#47A248"
    />
    <path
      d="M12 2.5v19.8c2.4-.4 4.8-2.7 4.8-7 0-4-3.5-9.8-4.8-12.8z"
      fill="#499D4A"
    />
  </svg>
);

// 15. Docker Logo
export const DockerIcon: React.FC<TechIconProps> = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="20" fill="#2496ED" />
    <rect x="14" y="20" width="4" height="3" fill="#FFFFFF" rx="0.5" />
    <rect x="19" y="20" width="4" height="3" fill="#FFFFFF" rx="0.5" />
    <rect x="24" y="20" width="4" height="3" fill="#FFFFFF" rx="0.5" />
    <rect x="19" y="16" width="4" height="3" fill="#FFFFFF" rx="0.5" />
    <rect x="24" y="16" width="4" height="3" fill="#FFFFFF" rx="0.5" />
    <rect x="24" y="12" width="4" height="3" fill="#FFFFFF" rx="0.5" />
    <path
      d="M33 22c-.5-1.5-1.7-2.3-3-2.3-.5 0-1 .2-1.5.5V20H13c-.6 0-1 .4-1 1 0 5 4 9 11 9 6.5 0 10.5-3.8 11-7.5.3-.2.6-.3.9-.3.4 0 .8.2 1.1.5.3-.3.4-.7.4-1.2 0-.6-.3-1.1-.7-1.4-.4-.5-.9-.8-1.7-1.1-.7-.3-1.3-.2-2 .5z"
      fill="#FFFFFF"
    />
  </svg>
);

// 16. Stripe Logo (Official 'S' mark)
export const StripeIcon: React.FC<TechIconProps> = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14.5 12.8c0-1.2.9-1.7 2.4-1.7 2.1 0 4.7.7 6.4 1.7V7.5c-2-0.8-4.3-1.2-6.5-1.2-5.7 0-9.6 3-9.6 8.1 0 7.9 10.9 6.6 10.9 10 0 1.4-1.2 1.9-2.8 1.9-2.4 0-5.4-1-7.5-2.2v5.4c2.4 1 5.1 1.5 7.6 1.5 5.9 0 10-2.9 10-8.2 0-8.6-10.9-7.1-10.9-10z"
      fill="#635BFF"
    />
  </svg>
);

// 17. Redis Logo
export const RedisIcon: React.FC<TechIconProps> = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="20" fill="#DC382D" />
    <path
      d="M24 14l11 4.5-11 4.5-11-4.5L24 14z"
      fill="#FFFFFF"
    />
    <path
      d="M13 22l11 4.5v5.5L13 27.5V22z"
      fill="#E5E7EB"
    />
    <path
      d="M35 22l-11 4.5v5.5l11-4.5V22z"
      fill="#D1D5DB"
    />
  </svg>
);
