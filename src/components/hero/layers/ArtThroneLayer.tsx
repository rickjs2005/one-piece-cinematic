"use client";

import Image from "next/image";
import throneArt from "../../../../public/art/throne.jpg";

/**
 * O trono (z10), camada mais ao fundo. Faz o dolly-out mais longo da cena:
 * começa em escala 3 e chega a 1, atravessando toda a timeline, para que o
 * recuo da câmera pareça contínuo mesmo trocando de camada no meio.
 */
export function ArtThroneLayer() {
  return (
    <div
      data-layer="art-throne"
      className="pointer-events-none absolute inset-0 z-10 opacity-0"
    >
      <Image
        src={throneArt}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* A arte original tem fundo azul claro; isto a puxa para a noite. */}
      <div className="bg-void/45 absolute inset-0" />
      <div className="from-void via-void/10 to-void absolute inset-0 bg-gradient-to-b" />
    </div>
  );
}
