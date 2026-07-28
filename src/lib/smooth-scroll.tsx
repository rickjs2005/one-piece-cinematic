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

    // Rede de segurança: o Lenis só emite `scroll` para o movimento que ele
    // mesmo conduz. Um scroll programático — âncora, tecla Home/End, ou a
    // restauração de posição do navegador ao recarregar — mexe na página sem
    // passar por ele, e o ScrollTrigger ficaria com a posição antiga (no nosso
    // caso, o painel da Jornada travava na primeira cena).
    const syncNative = () => ScrollTrigger.update();
    window.addEventListener("scroll", syncNative, { passive: true });

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener("scroll", syncNative);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
