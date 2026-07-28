"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ELDERS } from "@/content/elders";
import { Silhouette } from "@/components/ui/Silhouette";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Galeria horizontal dos Cinco Anciães (mais Imu).
 *
 * O scroll vertical vira deslocamento horizontal. Como no hero, o palco é
 * `sticky` em vez de um pin do ScrollTrigger — sem pin-spacer e sem risco de
 * empurrar o resto da página se a medição sair errada.
 *
 * Em `prefers-reduced-motion` a trilha vira uma lista com scroll horizontal
 * comum, que o usuário controla no próprio ritmo.
 */
export function Elders() {
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
      className="relative h-[320svh] motion-reduce:h-auto"
      aria-label="Os Cinco Anciães"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden motion-reduce:static motion-reduce:h-auto motion-reduce:py-24">
        <header className="mb-12 px-6 md:px-16">
          <span className="label-caps text-crimson">O Governo Mundial</span>
          <h2 className="font-display mt-3 text-[clamp(2rem,5vw,4rem)] leading-none">
            Os Cinco Anciães
          </h2>
        </header>

        <div
          data-track
          className="flex w-max gap-6 px-6 md:gap-10 md:px-16 motion-reduce:w-auto motion-reduce:overflow-x-auto"
        >
          {ELDERS.map((elder) => (
            <article
              key={elder.id}
              className="border-mist/15 bg-void hover:border-crimson/50 group relative flex w-[78vw] shrink-0 flex-col border p-7 transition-colors duration-500 sm:w-[420px]"
            >
              <div className="from-crimson/8 pointer-events-none absolute inset-0 bg-gradient-to-b to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="mb-6 h-40 w-full opacity-70 transition-opacity duration-500 group-hover:opacity-100">
                <Silhouette variant={elder.silhouette} />
              </div>

              <span className="label-caps text-gold">{elder.domain}</span>
              <h3 className="font-display mt-2 text-3xl leading-tight">
                {elder.name}
              </h3>
              <p className="text-mist label-caps mt-1">{elder.title}</p>
              <p className="text-parchment/70 mt-5 text-sm leading-relaxed">
                {elder.line}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
