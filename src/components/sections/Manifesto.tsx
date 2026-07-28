"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LINES = ["Meu tesouro?", "Se quiserem,", "podem pegar."];

/**
 * Respiro entre o hero e a história. A fala que criou a Era dos Piratas,
 * revelada palavra a palavra.
 *
 * As palavras são quebradas no servidor (não com SplitText em runtime) para
 * que o texto exista no HTML — leitores de tela e busca leem a frase inteira,
 * não uma pilha de spans vazios.
 */
export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-word]", {
          opacity: 0,
          y: "0.4em",
          filter: "blur(8px)",
          duration: 0.9,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 65%",
            once: true,
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
      className="relative flex min-h-[90svh] items-center justify-center px-6 py-32"
    >
      <figure className="max-w-5xl">
        <blockquote className="font-display text-center text-[clamp(2rem,6.5vw,5.5rem)] leading-[1.05]">
          {LINES.map((line, lineIndex) => (
            <span key={line} className="block">
              {line.split(" ").map((word, wordIndex) => (
                <span
                  key={`${word}-${wordIndex}`}
                  data-word
                  className={
                    lineIndex === LINES.length - 1
                      ? "text-crimson inline-block italic"
                      : "inline-block"
                  }
                >
                  {word}{" "}
                </span>
              ))}
            </span>
          ))}
        </blockquote>

        <figcaption data-word className="text-mist mt-12 text-center">
          <span className="label-caps text-gold block">Gol D. Roger</span>
          <span className="mt-3 block text-sm">
            No cadafalso de Loguetown — a frase que soltou um navio de cada
            porto do mundo
          </span>
        </figcaption>
      </figure>
    </section>
  );
}
