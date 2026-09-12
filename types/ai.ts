export type AssistantState = "IDLE" | "THINKING" | "SPEAKING" | "ERROR" | "OFFLINE";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  audioUrl?: string;
  isAudioLoading?: boolean;
  audioError?: string;
  isStreaming?: boolean;
}

export interface ChatApiRequest {
  message: string;
  conversationId?: string;
  history?: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}

export interface ChatApiResponse {
  success: boolean;
  message: string;
  conversationId: string;
  shouldSpeak: boolean;
  error?: string;
}

export interface TTSApiRequest {
  text: string;
}

export interface VoiceConfig {
  voiceId: string;
  modelId: string;
  stability: number;
  similarity: number;
  style: number;
  speed: number;
  speakerBoost: boolean;
}

// Extensibility interface for future Speech-to-Text (STT) integration
export interface STTOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export interface PortfolioKnowledge {
  profile: {
    name: string;
    headline: string;
    title: string;
    location: string;
    experienceYears: number;
    availability: string;
    status: string;
    bio: string;
  };
  about: {
    summary: string;
    philosophy: string;
    specialties: string[];
    passion: string;
  };
  education: Array<{
    degree: string;
    institution: string;
    period: string;
    details: string;
  }>;
  experience: Array<{
    role: string;
    company: string;
    period: string;
    highlights: string[];
  }>;
  skills: {
    core: string[];
    architecture: string[];
    methodologies: string[];
  };
  programmingLanguages: Array<{
    name: string;
    level: string;
    context: string;
  }>;
  frameworks: Array<{
    name: string;
    type: "frontend" | "backend" | "fullstack" | "styling";
    context: string;
  }>;
  tools: string[];
  databases: Array<{
    name: string;
    type: string;
    usage: string;
  }>;
  webDevelopment: {
    focus: string;
    capabilities: string[];
  };
  gameDevelopment: {
    focus: string;
    capabilities: string[];
  };
  fiveMDevelopment: {
    focus: string;
    frameworks: string[];
    capabilities: string[];
    customSystems: string[];
  };
  cloudNetworking: {
    focus: string;
    capabilities: string[];
  };
  projects: Array<{
    id: string;
    title: string;
    category: string;
    description: string;
    techStack: string[];
    highlights: string[];
    liveUrl?: string;
    githubUrl?: string;
  }>;
  achievements: string[];
  links: {
    github: string;
    linkedin: string;
    twitter: string;
    fiverr: string;
    website: string;
  };
  contact: {
    email: string;
    discord?: string;
    preferredMethod: string;
    availability: string;
  };
}
