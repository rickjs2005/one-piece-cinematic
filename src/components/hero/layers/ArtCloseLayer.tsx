"use client";

import Image from "next/image";
import eyesArt from "../../../../public/art/eyes.webp";

/**
 * A arte em close (z20). Entra em ~18% da cena, quando a câmera já recuou o
 * suficiente para que uma imagem raster não apareça esticada, e sai em ~55%,
 * quando o trono assume.
 */
export function ArtCloseLayer() {
  return (
    <div
      data-layer="art-close"
      className="pointer-events-none absolute inset-0 z-20 opacity-0"
    >
      <Image
        src={eyesArt}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Escurece a arte para que ela case com o preto absoluto do fundo. */}
      <div className="bg-void/35 absolute inset-0" />
    </div>
  );
}
