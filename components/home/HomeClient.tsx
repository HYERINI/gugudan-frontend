"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { startNewChat } from "@/lib/chatNav";
import AppFooter from "../layout/AppFooter";
import HeroSection from "@/components/home/HeroSection";
import MbtiSimulationSection from "@/components/home/MbtiSimulationSection";
import ServiceSection from "@/components/home/ServiceSection";
import MbtiSection from "@/components/home/MbtiSection";
import TeamSection from "@/components/home/TeamSection";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import EmpathyHowDifferentSection from "@/components/home/EmpathyHowDifferentSection";

export default function HomeClient() {
  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (!hash) return;
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="min-h-screen">
      <section id="top" className="bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-4 pt-4 pb-12">
          <HeroSection />    
        </div>
      </section>

      <section id="simulation" className="bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-4 pt-40 pb-40"> {/* pt-20 → pt-40 */}
          <MbtiSimulationSection />
        </div>
      </section>
      <section id="start" className="bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto pt-20 pb-28">
          <EmpathyHowDifferentSection />
        </div>
      </section>

      <section id="about" className="bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-28">
          <ServiceSection />
        </div>
      </section>

      <section id="mbti" className="bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-28">
          <MbtiSection />
        </div>
      </section>

      <section id="team" className="bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-28">
          <TeamSection />
        </div>
      </section>

      <AppFooter />
      <ScrollToTopButton />
    </div>
  );
}