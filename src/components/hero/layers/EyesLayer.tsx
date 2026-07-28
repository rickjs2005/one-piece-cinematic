"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Os olhos da Cena 1, desenhados em SVG.
 *
 * São vetoriais de propósito: nos primeiros 30% da cena eles aparecem em close
 * absoluto e recuam com a câmera. Uma imagem raster escalada nesse trecho
 * apareceria pixelada, e não poderia piscar.
 *
 * A assimetria (olho esquerdo menor e mais baixo) copia a perspectiva da arte
 * de referência — o rosto está levemente de três quartos, não de frente.
 */

type EyeProps = {
  cx: number;
  cy: number;
  scale: number;
  rotate: number;
};

function Eye({ cx, cy, scale, rotate }: EyeProps) {
  return (
    // O <g> externo carrega o posicionamento estático. O interno é o único que
    // o GSAP toca — separá-los evita que a piscada sobrescreva a perspectiva.
    <g transform={`translate(${cx} ${cy}) rotate(${rotate}) scale(${scale})`}>
      <g data-eye-lid>
        {/* Halo carmesim que vaza para a escuridão ao redor. */}
        <g data-eye-halo>
          <circle r="46" fill="var(--color-glow)" opacity="0.22" filter="url(#eyeGlow)" />
        </g>

        {/* Fatia de esclera visível — quase toda a pálpebra está na sombra. */}
        <path
          d="M -52 2 C -30 -22, 30 -22, 52 2 C 30 20, -30 20, -52 2 Z"
          fill="var(--color-parchment)"
          opacity="0.9"
        />

        {/* Íris: anel escuro, anel carmesim, núcleo brilhante e pupila. */}
        <circle r="21" fill="#4a0512" />
        <circle r="17" fill="var(--color-crimson)" />
        <circle r="10.5" fill="var(--color-glow)" />
        <circle r="4.5" fill="#2a0207" />

        {/* Ponto especular minúsculo: é ele que faz o olho parecer molhado. */}
        <circle cx="-6" cy="-7" r="2.2" fill="var(--color-parchment)" opacity="0.75" />
      </g>
    </g>
  );
}

export function EyesLayer() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Vida própria, independente do scroll: com a página parada em 0% a cena
      // continua respirando. Sem isso a abertura vira uma imagem estática.
      const blink = gsap.timeline({ repeat: -1, repeatDelay: 4.4 });
      blink
        .to("[data-eye-lid]", {
          scaleY: 0.04,
          duration: 0.11,
          ease: "power2.in",
          transformOrigin: "50% 50%",
        })
        .to("[data-eye-lid]", {
          scaleY: 1,
          duration: 0.16,
          ease: "power2.out",
          transformOrigin: "50% 50%",
        });

      gsap.to("[data-eye-halo]", {
        opacity: 0.55,
        scale: 1.14,
        duration: 2.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        transformOrigin: "50% 50%",
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      data-layer="eyes"
      className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
    >
      <svg
        viewBox="-400 -220 800 440"
        className="h-full w-full"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="eyeGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
        </defs>

        {/* Olho esquerdo: mais distante da câmera, portanto menor e mais baixo. */}
        <Eye cx={-118} cy={34} scale={0.82} rotate={-6} />
        {/* Olho direito: mais próximo, maior, encarando de frente. */}
        <Eye cx={132} cy={-26} scale={1.06} rotate={-9} />
      </svg>
    </div>
  );
}
