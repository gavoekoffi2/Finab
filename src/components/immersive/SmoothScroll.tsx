"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function getLenis() {
  return lenisInstance;
}

// Défilement fluide et inertiel sur tout le site (désactivé si l'utilisateur réduit les animations).
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      anchors: { offset: -90 },
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      allowNestedScroll: true,
    });
    lenisInstance = lenis;

    return () => {
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  useEffect(() => {
    if (window.location.hash) return;
    lenisInstance?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
