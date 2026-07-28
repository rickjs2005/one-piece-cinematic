"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { applyHeroFinalState, buildHeroTimeline } from "@/lib/hero-timeline";
import { ArtCloseLayer } from "./layers/ArtCloseLayer";
import { ArtThroneLayer } from "./layers/ArtThroneLayer";
import { DarknessMask } from "./layers/DarknessMask";
import { EyesLayer } from "./layers/EyesLayer";
import { LightRaysLayer } from "./layers/LightRaysLayer";
import { SwordsLayer } from "./layers/SwordsLayer";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * O hero: 400vh de scroll controlando uma cena de 12 segundos.
 *
 * O palco é `position: sticky`, não um pin do ScrollTrigger. Sticky não cria
 * pin-spacer, não desloca o resto da página e não precisa de `refresh()` depois
 * que as imagens carregam — a altura do gatilho é 400vh e não depende do
 * conteúdo. O ScrollTrigger fica responsável só pelo scrub.
 */
export function ThroneHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const q = (selector: string) =>
        el.querySelector<HTMLElement>(selector);

      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
          wide: "(min-width: 768px)",
        },
        (context) => {
          const { motion, wide } = context.conditions as {
            motion: boolean;
            reduced: boolean;
            wide: boolean;
          };

          if (!motion) {
            applyHeroFinalState(q);
            return;
          }

          const tl = buildHeroTimeline(q, {
            allowBlur: wide,
            dollyDepth: wide ? 3 : 2,
          });

          ScrollTrigger.create({
            trigger: el,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            animation: tl,
          });
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative h-[400svh]"
      aria-label="One Piece — abertura"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <ArtThroneLayer />
        <LightRaysLayer />
        <ArtCloseLayer />
        <DarknessMask />
        <EyesLayer />
        <SwordsLayer />

        {/* Título e dica de scroll ficam acima de tudo. */}
        <div className="pointer-events-none absolute inset-0 z-[60] flex flex-col items-center justify-end pb-[12svh]">
          <h1
            data-hero-title
            className="font-display text-parchment px-6 text-center text-[clamp(2.5rem,8vw,7rem)] leading-[0.95] opacity-0"
          >
            One Piece
            <span className="text-crimson block text-[0.2em] tracking-[0.4em] uppercase not-italic opacity-80">
              a história que o mundo tentou apagar
            </span>
          </h1>
        </div>

        <div
          data-scroll-hint
          className="text-mist pointer-events-none absolute inset-x-0 bottom-10 z-[60] flex flex-col items-center gap-3"
        >
          <span className="label-caps">Role para revelar</span>
          <span className="via-crimson h-12 w-px bg-gradient-to-b from-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
