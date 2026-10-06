import { LeadProvider } from "@/components/LeadModal";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import { Pains, Statement, Modules } from "@/components/sections/Intro";
import ModuleOne from "@/components/sections/ModuleOne";
import ModuleTwo from "@/components/sections/ModuleTwo";
import { Outcomes, Speakers, Clients, Program, Audience, Gallery } from "@/components/sections/Proof";
import { Pricing, FinalCta, Footer, MobileBar } from "@/components/sections/Pricing";

export default function Home() {
  return (
    <LeadProvider>
      <Navbar />
      <main className="overflow-x-clip">
        <Hero />
        <Pains />
        <Statement />
        <Modules />
        <ModuleOne />
        <ModuleTwo />
        <Outcomes />
        <Speakers />
        <Clients />
        <Program />
        <Audience />
        <Gallery />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
      <MobileBar />
    </LeadProvider>
  );
}
