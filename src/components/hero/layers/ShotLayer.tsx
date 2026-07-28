"use client";

import Image, { type StaticImageData } from "next/image";

/**
 * Um plano da cena — uma imagem em tela cheia que o scroll aproxima ou afasta.
 *
 * As duas artes do hero são fotogramas cinematográficos completos, então cada
 * uma é uma camada só. A versão anterior tentava montar a cena empilhando
 * recortes de ilustrações chapadas e o meio da transição virava um borrão
 * cinza — não havia nada para mostrar entre um plano e o outro.
 */
type ShotLayerProps = {
  id: string;
  src: StaticImageData;
  z: number;
  priority?: boolean;
  /** Escurece o plano para casar com o preto do fundo. */
  shade?: string;
};

export function ShotLayer({
  id,
  src,
  z,
  priority = false,
  shade = "bg-abyss/25",
}: ShotLayerProps) {
  return (
    <div
      data-layer={id}
      className="pointer-events-none absolute inset-0 opacity-0"
      style={{ zIndex: z }}
    >
      <Image
        src={src}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover object-center"
      />
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
