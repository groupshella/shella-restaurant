import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Qaidha from "@/components/sections/Qaidha";
import Tiers from "@/components/sections/Tiers";
import Arsenal from "@/components/sections/Arsenal";
import FAQ from "@/components/sections/FAQ";

import Footer from "@/components/sections/Footer";
import VideoSection from "@/components/sections/VideoSection";
export default function Home() {
  return (
    <main className="bg-[#0D0A07] min-h-screen min-w-0 overflow-x-hidden">
      <Hero />
      <Features />
      <VideoSection />
      <Qaidha />
      <Tiers />
      <Arsenal />
      <FAQ />
      <Footer />
    </main>
  );
}
