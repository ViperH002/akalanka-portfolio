import { logger } from "@/lib/logger";

interface GitHubRepoItem {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  updated_at: string;
  topics?: string[];
}

export interface GitHubTelemetryResult {
  success: boolean;
  profile: {
    username: string;
    name: string;
    avatar: string;
    bio: string;
    publicRepos: number;
    followers: number;
    following: number;
    profileUrl: string;
  };
  stats: {
    totalStars: number;
    totalForks: number;
    topLanguages: string[];
  };
  repositories: Array<{
    name: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
    url: string;
    updatedAt: string;
  }>;
  cachedAt: string;
}

export interface WakaTimeTelemetryResult {
  success: boolean;
  grandTotal: { text: string; total_seconds: number };
  languages: Array<unknown>;
  categories: Array<unknown>;
  projects: Array<unknown>;
  range: { text: string };
}

export class TelemetryService {
  /**
   * Fetches and aggregates GitHub developer telemetry
   */
  async getGitHubTelemetry(): Promise<GitHubTelemetryResult> {
    const token = process.env.GITHUB_TOKEN;
    const rawUsername = process.env.GITHUB_USERNAME || "ViperH002";
    const safeUsername = encodeURIComponent(rawUsername.trim());

    const headers: Record<string, string> = {
      "User-Agent": "Akalanka-Portfolio-Sync",
      Accept: "application/vnd.github.v3+json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    logger.debug("Syncing GitHub telemetry", {
      subsystem: "telemetry",
      data: { username: safeUsername },
    });

    // 1. Fetch GitHub User Profile
    const userRes = await fetch(`https://api.github.com/users/${safeUsername}`, {
      headers,
      next: { revalidate: 600 },
    });

    if (!userRes.ok) {
      logger.error("GitHub user profile fetch failed", {
        subsystem: "telemetry",
        data: { status: userRes.status },
      });
      throw new Error("Failed to fetch GitHub profile.");
    }

    const userData = await userRes.json();

    // 2. Fetch Recent Public Repositories
    const reposRes = await fetch(
      `https://api.github.com/users/${safeUsername}/repos?sort=pushed&per_page=8`,
      {
        headers,
        next: { revalidate: 600 },
      }
    );

    let reposData: GitHubRepoItem[] = [];
    if (reposRes.ok) {
      reposData = await reposRes.json();
    }

    // 3. Compute telemetry stats
    let totalStars = 0;
    let totalForks = 0;
    const languagesSet = new Set<string>();

    const repos = reposData.map((repo) => {
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;
      if (repo.language) languagesSet.add(repo.language);

      return {
        name: repo.name,
        description: repo.description || "Production repository codebase.",
        language: repo.language || "TypeScript",
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        url: repo.html_url,
        updatedAt: repo.updated_at,
      };
    });

    return {
      success: true,
      profile: {
        username: userData.login,
        name: userData.name || "Akalanka Egodawatte",
        avatar: userData.avatar_url,
        bio: userData.bio || "Full Stack Software Engineer & Systems Architect",
        publicRepos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
        profileUrl: userData.html_url,
      },
      stats: {
        totalStars,
        totalForks,
        topLanguages: Array.from(languagesSet),
      },
      repositories: repos,
      cachedAt: new Date().toISOString(),
    };
  }

  /**
   * Fetches WakaTime coding metrics with Authorization header to prevent query param credential exposure
   */
  async getWakaTimeTelemetry(): Promise<WakaTimeTelemetryResult> {
    const apiKey = process.env.WAKATIME_API_KEY;

    if (!apiKey) {
      logger.warn("WakaTime API key not configured", { subsystem: "telemetry" });
      throw new Error("WakaTime API key not configured.");
    }

    // Official WakaTime Basic Auth header prevents query string exposure
    const encodedKey = Buffer.from(apiKey.trim()).toString("base64");

    logger.debug("Querying WakaTime telemetry status", { subsystem: "telemetry" });

    const res = await fetch("https://wakatime.com/api/v1/users/current/status_bar/today", {
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${encodedKey}`,
      },
      next: { revalidate: 300 }, // Cache 5 minutes
    });

    if (!res.ok) {
      logger.error("Failed to fetch WakaTime status bar", {
        subsystem: "telemetry",
        data: { status: res.status },
      });
      throw new Error("Failed to fetch WakaTime telemetry.");
    }

    const json = await res.json();
    const data = json.data || {};

    return {
      success: true,
      grandTotal: data.grand_total || { text: "0 secs", total_seconds: 0 },
      languages: data.languages || [],
      categories: data.categories || [],
      projects: data.projects || [],
      range: data.range || { text: "Today" },
    };
  }
}

export const telemetryService = new TelemetryService();
