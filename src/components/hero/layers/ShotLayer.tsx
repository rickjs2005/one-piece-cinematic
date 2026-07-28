"use client";

import { useRef, useSyncExternalStore } from "react";
import Image, { type StaticImageData } from "next/image";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Assina a media query de movimento reduzido.
 *
 * `useSyncExternalStore` em vez de `useEffect` + `setState`: matchMedia é uma
 * fonte externa, e é para isso que este hook existe. Ele também resolve a
 * hidratação — o snapshot do servidor é `false`, e o cliente reconcilia no
 * primeiro render em vez de disparar um segundo render em efeito.
 */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const query = window.matchMedia(REDUCED_MOTION);
      query.addEventListener("change", onStoreChange);
      return () => query.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

/**
 * Um plano da cena — vídeo em loop, com a arte estática como pôster.
 *
 * As duas artes do hero viraram vídeo: o dolly-out agora é movimento de câmera
 * de verdade, não uma imagem sendo escalada. A imagem continua no componente
 * como `poster` (aparece enquanto o vídeo carrega) e como plano B quando o
 * visitante pede movimento reduzido — nesse caso o vídeo nem é montado.
 *
 * O contrato com a timeline não mudou: quem anima continua mirando o
 * `data-layer` do contêiner, sem saber se dentro dele tem vídeo ou imagem.
 */
type ShotLayerProps = {
  id: string;
  video: string;
  poster: StaticImageData;
  z: number;
  priority?: boolean;
  /** Escurece o plano para casar com o preto do fundo. */
  shade?: string;
};

export function ShotLayer({
  id,
  video,
  poster,
  z,
  priority = false,
  shade = "bg-abyss/25",
}: ShotLayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();

  return (
    <div
      data-layer={id}
      // O preloader conta estas mídias para saber quando abrir a cortina.
      data-hero-preload
      className="pointer-events-none absolute inset-0 opacity-0"
      style={{ zIndex: z }}
    >
      {reduced ? (
        <Image
          src={poster}
          alt=""
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover object-center"
        />
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-center"
          src={video}
          poster={poster.src}
          autoPlay
          muted
          loop
          playsInline
          // `metadata`, nunca `auto`: os dois vídeos somam 14MB e disputavam a
          // fila de conexões com as dezenas de imagens da página. Com metadata
          // o navegador busca o suficiente para começar e continua durante a
          // reprodução.
          preload="metadata"
        />
      )}

      <div className={`absolute inset-0 ${shade}`} />
      {/* Vinheta suave. A escuridão pesada é trabalho da camada do hero, que
          anima; se as duas escurecessem forte a arte não apareceria nunca. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(5,7,13,0.35) 80%, rgba(5,7,13,0.7) 100%)",
        }}
      />
    </div>
  );
}
