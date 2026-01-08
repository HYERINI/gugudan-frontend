"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { startNewChat } from "@/lib/chatNav";
import { scrollToId } from "@/lib/utils";
import AppFooter from "../layout/AppFooter";
import { Section } from "@/components/layout/Section";
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
    scrollToId(id);
  }, []);

  return (
    <div className="min-h-screen">
      <Section id="top" variant="compact" containerClassName="pt-4 pb-12">
        <HeroSection />    
      </Section>

      <Section id="simulation" variant="spacious">
        <MbtiSimulationSection />
      </Section>

      <Section id="start">
        <EmpathyHowDifferentSection />
      </Section>

      <Section id="about">
        <ServiceSection />
      </Section>

      <Section id="mbti">
        <MbtiSection />
      </Section>

      <Section id="team">
        <TeamSection />
      </Section>

      <AppFooter />
      <ScrollToTopButton />
    </div>
  );
}