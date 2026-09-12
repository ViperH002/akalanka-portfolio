import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { TechStack } from "@/components/sections/TechStack";
import { Process } from "@/components/sections/Process";
import { Packages } from "@/components/sections/Packages";
import { Portfolio } from "@/components/sections/Portfolio";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/layout/Footer";
import dynamic from "next/dynamic";
import { CyberScrollCanvas } from "@/components/effects/CyberScrollCanvas";

// Code-split AI Assistant to reduce initial page First Load JS
const AIChat = dynamic(
  () => import("@/components/ai-assistant/AIChat").then((mod) => mod.AIChat)
);

export default function Home() {
  return (
    <>
      {/* 61-Frame Cybernetic Scroll Canvas Engine */}
      <CyberScrollCanvas />

      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 relative z-10 focus:outline-none">
        <Hero />
        <Services />
        <TechStack />
        <Process />
        <Packages />
        <Portfolio />
        <Testimonials />
        <FAQ />
        <ContactSection />
      </main>
      <Footer />

      {/* Futuristic Cybernetic AI Portfolio Assistant */}
      <AIChat />
    </>
  );
}
