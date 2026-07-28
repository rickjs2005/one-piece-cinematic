"use client";

import { useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Fundo com parallax para uma seção inteira.
 *
 * A imagem é renderizada 130% mais alta que a seção e desliza no eixo Y
 * conforme a seção atravessa a viewport. É o que faz as seções pararem de
 * parecer blocos de texto estáticos empilhados.
 *
 * `intensity` é a fração da sobra que se move — 1 usa toda a folga de 30%.
 */
type ParallaxBackdropProps = {
  src: StaticImageData;
  intensity?: number;
  /** Opacidade da imagem. O texto por cima precisa continuar legível. */
  opacity?: number;
};

export function ParallaxBackdrop({
  src,
  intensity = 1,
  opacity = 0.4,
}: ParallaxBackdropProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-parallax-img]",
          { yPercent: -11 * intensity },
          {
            yPercent: 11 * intensity,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [intensity] },
  );

  return (
    <div
      ref={root}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div data-parallax-img className="absolute inset-x-0 -top-[15%] h-[130%]">
        <Image
          src={src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          style={{ opacity }}
        />
      </div>
      {/* Degradê para o fundo da página nas duas pontas: sem isso a imagem
          termina numa linha reta e denuncia que é um retângulo colado. */}
      <div className="from-abyss via-abyss/55 to-abyss absolute inset-0 bg-gradient-to-b" />
    </div>
  );
}
