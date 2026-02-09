import { useRef, useState, useEffect } from "react";
import { useScroll, useTransform } from "framer-motion";
import { DemoStatus } from "@/lib/types/landing";

export function useLandingAnimations() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [demoStatus, setDemoStatus] = useState<DemoStatus>("extracting");
  const heroRef = useRef<HTMLDivElement>(null);
  const ecoRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const mockupY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const innerMockupY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  const { scrollYProgress: ecoScroll } = useScroll({
    target: ecoRef,
    offset: ["start end", "end start"],
  });

  const ecoY1 = useTransform(ecoScroll, [0, 1], [0, -60]);
  const ecoY2 = useTransform(ecoScroll, [0, 1], [0, -30]);
  const ecoY3 = useTransform(ecoScroll, [0, 1], [0, -80]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return {
    isMenuOpen,
    setIsMenuOpen,
    scrolled,
    demoStatus,
    setDemoStatus,
    heroRef,
    ecoRef,
    mockupY,
    innerMockupY,
    opacity,
    scale,
    ecoY1,
    ecoY2,
    ecoY3,
  };
}
