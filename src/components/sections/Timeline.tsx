"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ARCS } from "@/content/arcs";
import { Reveal } from "@/components/ui/Reveal";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Linha do tempo da saga final.
 *
 * A linha vertical carmesim cresce em `scaleY` acompanhando o progresso do
 * scroll dentro da seção — é o único elemento com scrub aqui; o texto entra
 * com o Reveal padrão, que não amarra leitura ao movimento do dedo.
 */
export function Timeline() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-spine]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "50% 0%",
            scrollTrigger: {
              trigger: root.current,
              start: "top 70%",
              end: "bottom 80%",
              scrub: 0.6,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative px-6 py-32 md:px-16"
      aria-label="A saga final"
    >
      <Reveal className="mb-20">
        <span className="label-caps text-crimson">O que ainda vem</span>
        <h2 className="font-display mt-3 text-[clamp(2rem,5vw,4rem)] leading-none">
          A Saga Final
        </h2>
      </Reveal>

      <div className="relative mx-auto max-w-3xl">
        {/* Trilho de fundo + linha viva que cresce com o scroll. */}
        <div className="bg-mist/12 absolute top-2 bottom-2 left-[7px] w-px md:left-[9px]" />
        <div
          data-spine
          className="bg-crimson absolute top-2 bottom-2 left-[7px] w-px md:left-[9px]"
        />

        <ol className="space-y-16">
          {ARCS.map((arc, index) => (
            <li key={arc.name} className="relative pl-10 md:pl-14">
              <Reveal delay={index * 0.04}>
                <span
                  className={`absolute top-1.5 left-0 h-4 w-4 rounded-full border-2 md:h-[22px] md:w-[22px] ${
                    arc.unrevealed
                      ? "border-mist/40 bg-void"
                      : "border-crimson bg-crimson/25"
                  }`}
                  aria-hidden="true"
                />
                <span className="label-caps text-gold">{arc.marker}</span>
                <h3 className="font-display mt-2 text-3xl md:text-4xl">
                  {arc.name}
                </h3>
                <p className="text-parchment/70 mt-3 max-w-xl leading-relaxed">
                  {arc.description}
                </p>
                {arc.unrevealed && (
                  <p className="text-mist label-caps mt-4">
                    Ainda não revelado na obra
                  </p>
                )}
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
