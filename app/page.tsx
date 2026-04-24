import Hero from "@/components/sections/Home/Hero";
import Features from "@/components/sections/Home/Features";
import Qaidha from "@/components/sections/Home/Qaidha";
import Tiers from "@/components/sections/Home/Tiers";
import Arsenal from "@/components/sections/Home/Arsenal";
import FAQ from "@/components/sections/Home/FAQ";

import Footer from "@/components/sections/Home/Footer";
import VideoSection from "@/components/sections/Home/VideoSection";
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
