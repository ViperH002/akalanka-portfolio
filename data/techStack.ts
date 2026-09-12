import { TechCategory } from "@/types";

export const techCategoriesData: TechCategory[] = [
  {
    title: "Frontend",
    items: [
      { name: "React", color: "#61DAFB" },
      { name: "Next.js", color: "#FFFFFF" },
      { name: "TypeScript", color: "#3178C6" },
      { name: "Tailwind", color: "#06B6D4" },
      { name: "JavaScript", color: "#F7DF1E" },
      { name: "HTML5", color: "#E34F26" },
      { name: "CSS3", color: "#1572B6" },
    ],
  },
  {
    title: "Backend",
    items: [
      { name: "Node.js", color: "#339933" },
      { name: "Express.js", color: "#FFFFFF" },
      { name: "Laravel", color: "#FF2D20" },
      { name: "PHP", color: "#777BB4" },
    ],
  },
  {
    title: "Database",
    items: [
      { name: "MongoDB", color: "#47A248" },
      { name: "PostgreSQL", color: "#336791" },
      { name: "MySQL", color: "#4479A1" },
    ],
  },
  {
    title: "Tools & Services",
    items: [
      { name: "Firebase", color: "#FFCA28" },
      { name: "Stripe", color: "#635BFF" },
      { name: "Vercel", color: "#FFFFFF" },
      { name: "Netlify", color: "#00C7B7" },
    ],
  },
];
