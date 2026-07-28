"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ParallaxBackdrop } from "@/components/ui/ParallaxBackdrop";
import execution from "../../../public/art/execution.webp";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LINES = ["Meu tesouro?", "Se quiserem,", "podem pegar."];

/**
 * A fala que criou a Era dos Piratas, sobre o cadafalso de Loguetown.
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
          yPercent: 60,
          filter: "blur(10px)",
          duration: 0.9,
          stagger: 0.08,
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
      className="relative flex min-h-[110svh] items-center justify-center overflow-hidden px-6 py-32"
    >
      <ParallaxBackdrop src={execution} opacity={0.45} />

      <figure className="relative z-10 max-w-6xl">
        <blockquote className="display text-center text-[clamp(2.75rem,11vw,10rem)] leading-[1.02]">
          {LINES.map((line, lineIndex) => (
            // `pt` dentro do contêiner mascarado: o overflow-hidden existe para
            // esconder as palavras enquanto elas sobem, mas sem folga no topo
            // ele corta os acentos das próprias letras.
            <span key={line} className="block overflow-hidden pt-[0.06em]">
              {line.split(" ").map((word, wordIndex) => (
                // O espaço vai como margem, não como caractere: dentro de um
                // `inline-block` o espaço em branco colapsa e as palavras
                // ficam grudadas ("MEUTESOURO?").
                <span
                  key={`${word}-${wordIndex}`}
                  data-word
                  className={
                    lineIndex === LINES.length - 1
                      ? "text-blood mr-[0.22em] inline-block"
                      : "mr-[0.22em] inline-block"
                  }
                >
                  {word}
                </span>
              ))}
            </span>
          ))}
        </blockquote>

        <figcaption data-word className="text-fog mt-12 text-center">
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
