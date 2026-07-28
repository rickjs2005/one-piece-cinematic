"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ERA } from "@/content/era";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * O prólogo: como a Era dos Piratas começou.
 *
 * O texto começa mascarado por `clip-path` e é descoberto de cima para baixo,
 * espelhando a lógica de revelação do hero. O conteúdo está inteiro no HTML —
 * a máscara é puramente visual, então leitores de tela leem tudo desde o
 * primeiro frame.
 */
export function Era() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-era-block]").forEach((block) => {
          const enter = { trigger: block, start: "top 72%", once: true };

          gsap.fromTo(
            block.querySelector("[data-era-index]"),
            { opacity: 0, xPercent: -40 },
            {
              opacity: 1,
              xPercent: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: enter,
            },
          );

          gsap.fromTo(
            block.querySelector("[data-era-body]"),
            { clipPath: "inset(0 0 100% 0)", opacity: 0.15 },
            {
              clipPath: "inset(0 0 0% 0)",
              opacity: 1,
              duration: 1.1,
              ease: "power2.out",
              scrollTrigger: enter,
            },
          );

          gsap.fromTo(
            block.querySelector("[data-era-rule]"),
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.2,
              ease: "power3.out",
              transformOrigin: "0% 50%",
              scrollTrigger: enter,
            },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative px-6 py-32 md:px-16"
      aria-label="A Era dos Piratas"
    >
      <header className="mx-auto mb-24 max-w-4xl">
        <span className="label-caps text-blood">Como tudo começou</span>
        <h2 className="display mt-4 text-[clamp(2.5rem,8vw,7rem)]">
          A Era <span className="text-hollow">dos Piratas</span>
        </h2>
      </header>

      <div className="mx-auto max-w-4xl space-y-28">
        {ERA.map((block) => (
          <article key={block.index} data-era-block>
            <div className="flex items-baseline gap-6">
              <span
                data-era-index
                className="display text-blood/70 text-6xl md:text-8xl"
              >
                {block.index}
              </span>
              <h3 className="display text-2xl md:text-4xl">{block.title}</h3>
            </div>

            <div
              data-era-rule
              className="via-blood mt-6 mb-7 h-px w-full bg-gradient-to-r from-transparent to-transparent"
            />

            <p
              data-era-body
              className="text-parchment/80 max-w-3xl text-lg leading-relaxed md:text-xl"
            >
              {block.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
