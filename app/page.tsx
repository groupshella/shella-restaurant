import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Qaidha from "@/components/sections/Qaidha";
import Tiers from "@/components/sections/Tiers";
import Arsenal from "@/components/sections/Arsenal";
import FAQ from "@/components/sections/FAQ";
import FooterCTA from "@/components/sections/FooterCTA";

export default function Home() {
  return (
    <main className="bg-[#0D0A07] min-h-screen min-w-0 overflow-x-hidden">
      <Hero />
      <Features />
      <Qaidha />
      <Tiers />
      <Arsenal />
      <FAQ />
      <FooterCTA />
    </main>
  );
}
