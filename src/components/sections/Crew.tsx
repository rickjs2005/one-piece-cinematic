"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CREW } from "@/content/crew";
import { CrewEmblem } from "@/components/ui/CrewEmblem";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * A tripulação, em galeria horizontal.
 *
 * O scroll vertical vira deslocamento horizontal. Como no hero, o palco é
 * `sticky` em vez de um pin do ScrollTrigger — sem pin-spacer e sem risco de
 * empurrar o resto da página se a medição sair errada.
 *
 * Em `prefers-reduced-motion` a trilha vira uma lista com scroll horizontal
 * comum, que o usuário controla no próprio ritmo.
 */
export function Crew() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const track = root.current?.querySelector<HTMLElement>("[data-track]");
        if (!track) return;

        gsap.to(track, {
          // Função em vez de valor fixo: recalculado a cada refresh, então
          // girar o celular ou redimensionar não quebra o fim da trilha.
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative h-[520svh] motion-reduce:h-auto"
      aria-label="Os Piratas do Chapéu de Palha"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden motion-reduce:static motion-reduce:h-auto motion-reduce:py-24">
        <header className="mb-10 px-6 md:px-16">
          <span className="label-caps text-crimson">Dez pessoas, dez sonhos</span>
          <h2 className="font-display mt-3 text-[clamp(2rem,5vw,4rem)] leading-none">
            Os Chapéus de Palha
          </h2>
        </header>

        <div
          data-track
          className="flex w-max gap-6 px-6 md:gap-8 md:px-16 motion-reduce:w-auto motion-reduce:overflow-x-auto"
        >
          {CREW.map((mate) => (
            <article
              key={mate.id}
              className="border-mist/15 bg-void hover:border-crimson/50 group relative flex w-[80vw] shrink-0 flex-col border p-7 transition-colors duration-500 sm:w-[380px]"
            >
              <div className="from-crimson/8 pointer-events-none absolute inset-0 bg-gradient-to-b to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="text-gold mb-6 h-28 w-28 opacity-70 transition-opacity duration-500 group-hover:opacity-100">
                <CrewEmblem variant={mate.emblem} />
              </div>

              <span className="label-caps text-gold">{mate.role}</span>
              <h3 className="font-display mt-2 text-3xl leading-tight">
                {mate.name}
              </h3>

              <p className="text-mist mt-4 text-sm leading-relaxed">
                <span className="label-caps text-parchment/50 block">Sonho</span>
                {mate.dream}
              </p>

              <blockquote className="border-crimson/60 mt-6 border-l-2 pl-4">
                <p className="font-display text-parchment text-xl leading-snug italic">
                  “{mate.quote}”
                </p>
              </blockquote>

              <p className="text-mist/70 label-caps mt-auto pt-6">
                Recompensa ฿ {mate.bounty}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
