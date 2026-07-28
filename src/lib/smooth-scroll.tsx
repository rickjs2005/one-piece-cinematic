"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/**
 * Liga o Lenis ao ScrollTrigger.
 *
 * O Lenis passa a ser a única fonte de verdade do scroll: ele roda dentro do
 * ticker do GSAP (em vez de um rAF próprio) para que scroll e timeline sejam
 * atualizados no mesmo frame. Sem isso, as camadas do hero ficam um frame
 * atrás do scroll e a cena "borracha".
 *
 * Se `prefers-reduced-motion` estiver ativo o Lenis nem é instanciado — o
 * scroll nativo do navegador é o comportamento correto nesse caso.
 */
export function SmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) return;

    const lenis = new Lenis({ lerp: 0.08 });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
