// app/page.tsx  (ou pages/index.tsx)
import { LandingHero } from "@/components/LandingHero";
import { LiveGauges } from "@/components/Livegauges";
import { Features } from "@/components/Features";
import { ThermoAnimation } from "@/components/ThermoAnimation";
import { HowItWorks } from "@/components/HowItWorks";
import { LandingFooter } from "@/components/LandingFooter";
import { SectionDivider } from "@/components/SectionDivider";
import PublicNavbar from "@/components/PublicNavbar";
import ChatbotHome from '@/components/ChatbotHome'
export default function Landing() {
  return (
    <>
    <ChatbotHome />
      <PublicNavbar />
      <div className="dark min-h-screen bg-background">
        {/* Floating particles */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-purple-400/10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <LandingHero />
          <SectionDivider />
          <LiveGauges />
          <Features />
          <ThermoAnimation />
          <HowItWorks />
          <LandingFooter />
        </div>

        <div className="fixed inset-0 bg-gradient-to-b from-purple-950/10 via-transparent to-violet-950/10 pointer-events-none -z-10" />

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0.1; }
            50% { transform: translateY(-20px) translateX(10px); opacity: 0.3; }
          }
        `}</style>
      </div>
    </>
  );
}