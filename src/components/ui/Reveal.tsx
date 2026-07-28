"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Atraso em segundos, para escalonar itens irmãos. */
  delay?: number;
};

/**
 * Entrada padrão das seções: sobe e aparece uma vez, ao entrar na viewport.
 *
 * Não usa scrub — conteúdo de leitura amarrado ao scroll fica ilegível se o
 * usuário parar no meio. Só o hero é scrubbed.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(root.current, {
          opacity: 0,
          y: 34,
          duration: 1,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 85%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [delay] },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
