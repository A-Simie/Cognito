import { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, useSpring } from "framer-motion";
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

  // Spring configuration for smooth motion
  const springConfig = {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  };

  const rawMockupY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const rawInnerMockupY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const rawScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.95]);

  const mockupY = useSpring(rawMockupY, springConfig);
  const innerMockupY = useSpring(rawInnerMockupY, springConfig);
  const opacity = useSpring(rawOpacity, springConfig);
  const scale = useSpring(rawScale, springConfig);

  const { scrollYProgress: ecoScroll } = useScroll({
    target: ecoRef,
    offset: ["start end", "end start"],
  });

  const ecoY1 = useSpring(
    useTransform(ecoScroll, [0, 1], [40, -40]),
    springConfig,
  );
  const ecoY2 = useSpring(
    useTransform(ecoScroll, [0, 1], [20, -20]),
    springConfig,
  );
  const ecoY3 = useSpring(
    useTransform(ecoScroll, [0, 1], [60, -60]),
    springConfig,
  );

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) setScrolled(isScrolled);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

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
