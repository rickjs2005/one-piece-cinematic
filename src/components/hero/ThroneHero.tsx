"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { applyHeroFinalState, buildHeroTimeline } from "@/lib/hero-timeline";
import { ShotLayer } from "./layers/ShotLayer";
import eyesShot from "../../../public/art/eyes-dark.webp";
import throneShot from "../../../public/art/throne-room.webp";

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

      const q = (selector: string) => el.querySelector<HTMLElement>(selector);

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
            dollyDepth: wide ? 1.85 : 1.45,
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
      <div className="bg-abyss sticky top-0 h-[100svh] w-full overflow-hidden">
        <ShotLayer
          id="throne"
          src={throneShot}
          z={10}
          priority
          shade="bg-abyss/20"
        />
        <ShotLayer
          id="eyes"
          src={eyesShot}
          z={20}
          priority
          shade="bg-abyss/10"
        />

        {/* Escuridão em volta da cena. Fica acima dos planos e abaixo do
            título — é ela que faz a abertura ler como breu. */}
        <div
          data-vignette
          className="pointer-events-none absolute inset-0 z-30"
          style={{
            background:
              "radial-gradient(ellipse at 50% 48%, transparent 22%, rgba(5,7,13,0.55) 52%, rgba(5,7,13,0.95) 85%)",
          }}
        />

        <div className="pointer-events-none absolute inset-0 z-[60] flex flex-col items-center justify-end pb-[14svh]">
          <h1
            data-hero-title
            className="display text-parchment px-6 text-center text-[clamp(3.5rem,15vw,13rem)] opacity-0"
          >
            One Piece
          </h1>
          <p
            data-hero-sub
            className="label-caps text-blood mt-6 px-6 text-center opacity-0"
          >
            A história que o mundo tentou apagar
          </p>
        </div>

        <div
          data-scroll-hint
          className="text-fog pointer-events-none absolute inset-x-0 bottom-10 z-[60] flex flex-col items-center gap-3"
        >
          <span className="label-caps">Role para revelar</span>
          <span className="via-blood h-12 w-px bg-gradient-to-b from-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
