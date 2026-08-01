"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { applyHeroFinalState, buildHeroTimeline } from "@/lib/hero-timeline";
import { READY_EVENT } from "@/lib/scroll";
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

  // O shell (site-shell.tsx) segura o portão fechado até o hero avisar que
  // tem quadro pra mostrar. Espera o `canplay` do primeiro vídeo interno —
  // som de "já dá pra tocar sem engasgar" — com um teto de 1,5s: rede lenta
  // ou `prefers-reduced-motion` (sem <video> nenhum montado) não podem
  // travar o portão pra sempre.
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    let done = false;
    const fire = () => {
      if (done) return;
      done = true;
      window.dispatchEvent(new Event(READY_EVENT));
    };

    const video = el.querySelector<HTMLVideoElement>("video");
    const timer = window.setTimeout(fire, 1500);

    if (!video || video.readyState >= 3) {
      fire();
    } else {
      video.addEventListener("canplay", fire, { once: true });
    }

    return () => {
      window.clearTimeout(timer);
      video?.removeEventListener("canplay", fire);
    };
  }, []);

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
      id="topo"
      className="relative h-[400svh]"
      aria-label="One Piece — abertura"
    >
      <div className="bg-abyss sticky top-0 h-[100svh] w-full overflow-hidden">
        <ShotLayer
          id="throne"
          video="/video/throne.mp4"
          poster={throneShot}
          z={10}
          priority
          shade="bg-abyss/20"
        />
        <ShotLayer
          id="eyes"
          video="/video/eyes.mp4"
          poster={eyesShot}
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
