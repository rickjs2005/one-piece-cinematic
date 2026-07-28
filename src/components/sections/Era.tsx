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
        const blocks = gsap.utils.toArray<HTMLElement>("[data-era-block]");

        blocks.forEach((block) => {
          gsap.fromTo(
            block.querySelector("[data-era-body]"),
            { clipPath: "inset(0 0 100% 0)", opacity: 0.15 },
            {
              clipPath: "inset(0 0 0% 0)",
              opacity: 1,
              duration: 1.1,
              ease: "power2.out",
              scrollTrigger: { trigger: block, start: "top 72%", once: true },
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
              scrollTrigger: { trigger: block, start: "top 72%", once: true },
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
      <header className="mx-auto mb-20 max-w-3xl">
        <span className="label-caps text-crimson">Como tudo começou</span>
        <h2 className="font-display mt-3 text-[clamp(2rem,5vw,4rem)] leading-none">
          A Era dos Piratas
        </h2>
      </header>

      <div className="mx-auto max-w-3xl space-y-24">
        {ERA.map((block) => (
          <article key={block.index} data-era-block>
            <div className="flex items-baseline gap-5">
              <span className="font-display text-crimson/60 text-4xl">
                {block.index}
              </span>
              <h3 className="font-display text-3xl md:text-4xl">
                {block.title}
              </h3>
            </div>

            <div data-era-rule className="rule-crimson mt-5 mb-6 w-full" />

            <p
              data-era-body
              className="text-parchment/75 text-lg leading-relaxed"
            >
              {block.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
