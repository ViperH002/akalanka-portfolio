export const cyberFrameFiles: string[] = [
  "img_00001.webp",
  "img_00007.webp",
  "img_00010.webp",
  "img_00015.webp",
  "img_00017.webp",
  "img_00023.webp",
  "img_00027.webp",
  "img_00029.webp",
  "img_00033.webp",
  "img_00039.webp",
  "img_00042.webp",
  "img_00046.webp",
  "img_00050.webp",
  "img_00054.webp",
  "img_00057.webp",
  "img_00061.webp",
  "img_00067.webp",
  "img_00070.webp",
  "img_00074.webp",
  "img_00077.webp",
  "img_00082.webp",
  "img_00087.webp",
  "img_00089.webp",
  "img_00094.webp",
  "img_00097.webp",
  "img_00102.webp",
  "img_00107.webp",
  "img_00109.webp",
  "img_00113.webp",
  "img_00117.webp",
  "img_00122.webp",
  "img_00127.webp",
  "img_00129.webp",
  "img_00133.webp",
  "img_00137.webp",
  "img_00142.webp",
  "img_00147.webp",
  "img_00150.webp",
  "img_00154.webp",
  "img_00157.webp",
  "img_00162.webp",
  "img_00167.webp",
  "img_00170.webp",
  "img_00173.webp",
  "img_00177.webp",
  "img_00182.webp",
  "img_00187.webp",
  "img_00189.webp",
  "img_00194.webp",
  "img_00197.webp",
  "img_00202.webp",
  "img_00207.webp",
  "img_00209.webp",
  "img_00213.webp",
  "img_00217.webp",
  "img_00222.webp",
  "img_00227.webp",
  "img_00229.webp",
  "img_00234.webp",
  "img_00237.webp",
  "img_00241.webp",
];

export const TOTAL_CYBER_FRAMES = cyberFrameFiles.length;

export const cyberFramePaths = cyberFrameFiles.map(
  (file) => `/cyber-frames/${file}`
);

export interface CyberTelemetryPhase {
  phase: string;
  name: string;
  range: [number, number];
  status: string;
}

export const cyberPhases: CyberTelemetryPhase[] = [
  { phase: "PHASE 01", name: "HUMAN CORE", range: [0, 0.2], status: "INITIALIZING" },
  { phase: "PHASE 02", name: "NEURAL REVEAL", range: [0.2, 0.4], status: "CIRCUITS ENGAGED" },
  { phase: "PHASE 03", name: "AUGMENTATION", range: [0.4, 0.6], status: "ARCHITECTURE SYNC" },
  { phase: "PHASE 04", name: "CYBER MATRIX", range: [0.6, 0.8], status: "SYSTEM DEPLOYED" },
  { phase: "PHASE 05", name: "FULL CYBERNETIC", range: [0.8, 1.0], status: "OVERDRIVE 100%" },
];
