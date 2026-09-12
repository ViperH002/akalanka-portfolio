import { portfolioData } from "@/data/portfolio";

/**
 * Compiles the structured portfolio knowledge base into a cleanly formatted,
 * dense context string for the AI assistant system prompt.
 */
export function getPortfolioContext(): string {
  const p = portfolioData;

  const languagesList = p.programmingLanguages
    .map((l) => `- ${l.name} (${l.level}): ${l.context}`)
    .join("\n");

  const frameworksList = p.frameworks
    .map((f) => `- ${f.name} [${f.type}]: ${f.context}`)
    .join("\n");

  const databasesList = p.databases
    .map((d) => `- ${d.name} (${d.type}): ${d.usage}`)
    .join("\n");

  const projectsList = p.projects
    .map(
      (proj) =>
        `### Project: ${proj.title} (${proj.category})\n` +
        `Description: ${proj.description}\n` +
        `Tech Stack: ${proj.techStack.join(", ")}\n` +
        `Highlights: ${proj.highlights.join("; ")}` +
        (proj.liveUrl ? `\nLive Demo: ${proj.liveUrl}` : "") +
        (proj.githubUrl ? `\nSource Repository: ${proj.githubUrl}` : "")
    )
    .join("\n\n");

  const educationList = p.education
    .map((e) => `- ${e.degree} | ${e.institution} (${e.period}): ${e.details}`)
    .join("\n");

  const experienceList = p.experience
    .map(
      (exp) =>
        `### ${exp.role} @ ${exp.company} (${exp.period})\n` +
        exp.highlights.map((h) => `- ${h}`).join("\n")
    )
    .join("\n\n");

  return `
[CANDIDATE PROFILE]
Name: ${p.profile.name}
Headline: ${p.profile.headline}
Title: ${p.profile.title}
Location: ${p.profile.location}
Experience: ${p.profile.experienceYears}+ years
Status: ${p.profile.status}
Bio: ${p.profile.bio}

[ABOUT & SPECIALTIES]
Summary: ${p.about.summary}
Philosophy: ${p.about.philosophy}
Specialties:
${p.about.specialties.map((s) => `- ${s}`).join("\n")}

[PROGRAMMING LANGUAGES]
${languagesList}

[FRAMEWORKS & LIBRARIES]
${frameworksList}

[TOOLS & DEVOPS]
${p.tools.join(", ")}

[DATABASES & STORAGE]
${databasesList}

[WEB DEVELOPMENT CAPABILITIES]
Focus: ${p.webDevelopment.focus}
Capabilities:
${p.webDevelopment.capabilities.map((c) => `- ${c}`).join("\n")}

[FIVEM GAME SCRIPT DEVELOPMENT]
Focus: ${p.fiveMDevelopment.focus}
Supported Frameworks: ${p.fiveMDevelopment.frameworks.join(", ")}
Capabilities:
${p.fiveMDevelopment.capabilities.map((c) => `- ${c}`).join("\n")}
Custom Systems Created:
${p.fiveMDevelopment.customSystems.map((s) => `- ${s}`).join("\n")}

[CLOUD & NETWORKING]
Focus: ${p.cloudNetworking.focus}
Capabilities:
${p.cloudNetworking.capabilities.map((c) => `- ${c}`).join("\n")}

[PROJECT PORTFOLIO]
${projectsList}

[EDUCATION & CERTIFICATIONS]
${educationList}

[PROFESSIONAL WORK EXPERIENCE]
${experienceList}

[KEY ACHIEVEMENTS]
${p.achievements.map((a) => `- ${a}`).join("\n")}

[CONTACT INFORMATION & LINKS]
Email: ${p.contact.email}
Discord: ${p.contact.discord}
Preferred Contact: ${p.contact.preferredMethod}
Availability: ${p.contact.availability}
GitHub: ${p.links.github}
LinkedIn: ${p.links.linkedin}
Twitter: ${p.links.twitter}
Fiverr / Direct Inquiries: ${p.links.fiverr}
Website: ${p.links.website}
`.trim();
}
