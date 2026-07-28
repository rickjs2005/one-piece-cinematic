"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Faixa de texto rolando sem parar, que se inclina com a velocidade do scroll.
 *
 * Existe para dar movimento constante entre seções — antes, tudo que não
 * estava sendo rolado ficava completamente imóvel e a página parecia travada.
 *
 * O conteúdo é duplicado e a animação percorre exatamente 50% do total, então
 * a emenda cai no ponto em que a segunda cópia começa e o laço é invisível. A
 * cópia duplicada é `aria-hidden` para não ser lida duas vezes.
 *
 * A inclinação vai num elemento separado do deslocamento: o `skewX` e o
 * `xPercent` no mesmo alvo brigariam, e o `overwrite` do skew mataria o laço
 * infinito na primeira rolagem.
 */
type MarqueeProps = {
  items: string[];
  /** Segundos para uma volta completa. Maior = mais lento. */
  duration?: number;
  reverse?: boolean;
};

export function Marquee({
  items,
  duration = 34,
  reverse = false,
}: MarqueeProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to("[data-marquee-track]", {
          xPercent: reverse ? 50 : -50,
          duration,
          ease: "none",
          repeat: -1,
        });

        const skewer = root.current?.querySelector<HTMLElement>(
          "[data-marquee-skew]",
        );
        if (!skewer) return;

        const trigger = ScrollTrigger.create({
          onUpdate: (self) => {
            const skew = gsap.utils.clamp(-14, 14, self.getVelocity() / 220);
            gsap.to(skewer, {
              skewX: skew,
              duration: 0.5,
              ease: "power3.out",
              overwrite: true,
            });
          },
        });

        return () => trigger.kill();
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [duration, reverse] },
  );

  return (
    <div
      ref={root}
      className="border-parchment/10 relative overflow-hidden border-y py-5"
    >
      <div data-marquee-skew>
        <div
          data-marquee-track
          className="flex w-max gap-10 will-change-transform"
          style={{ transform: reverse ? "translateX(-50%)" : undefined }}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex gap-10" aria-hidden={copy === 1}>
              {items.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="display text-parchment/35 flex items-center gap-10 text-2xl whitespace-nowrap md:text-4xl"
                >
                  {item}
                  <span className="bg-blood inline-block h-2 w-2 rotate-45" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
