"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import flag from "../../../public/art/flag.webp";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * A bandeira, revelada por uma janela que se abre.
 *
 * A imagem está sempre em tela cheia e em escala real; o que anima é o
 * `clip-path`, que começa como uma fresta no centro e se abre até as bordas.
 * Escalar a imagem daria o mesmo gesto, mas passaria metade da animação
 * mostrando pixels ampliados — assim ela fica nítida do primeiro frame ao
 * último.
 */
export function FlagReveal() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });

        tl.fromTo(
          "[data-flag-window]",
          { clipPath: "inset(38% 34% 38% 34%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 1 },
          0,
        )
          .fromTo(
            "[data-flag-img]",
            { scale: 1.28 },
            { scale: 1, ease: "none", duration: 1 },
            0,
          )
          .fromTo(
            "[data-flag-title]",
            { opacity: 0, scale: 0.86 },
            { opacity: 1, scale: 1, ease: "power2.out", duration: 0.4 },
            0.42,
          );
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative h-[260svh]"
      aria-label="A bandeira"
    >
      <div className="bg-abyss sticky top-0 h-[100svh] overflow-hidden">
        <div data-flag-window className="absolute inset-0">
          <div data-flag-img className="absolute inset-0">
            <Image
              src={flag}
              alt="A bandeira dos Chapéus de Palha tremulando contra o céu"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div className="bg-abyss/30 absolute inset-0" />
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
          <p
            data-flag-title
            className="display text-parchment max-w-5xl text-center text-[clamp(2rem,7vw,6rem)] leading-[1.04] opacity-0 [text-shadow:0_4px_40px_rgba(5,7,13,0.9)]"
          >
            Uma bandeira não é uma ameaça.
            <span className="text-blood block">É uma promessa.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
