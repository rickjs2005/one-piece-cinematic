"use client";

import Image from "next/image";
import throneArt from "../../../../public/art/throne.jpg";

/**
 * Espadas em primeiro plano (z50). É a faixa inferior da própria arte do trono,
 * reenquadrada: `object-bottom` com o contêiner recortado em 44% da altura
 * mostra exatamente a floresta de espadas cravadas na escadaria.
 *
 * Entra em ~75%, quando a cena já está revelada, e permanece desfocada — é
 * primeiro plano, não assunto. A máscara no topo evita a linha de corte reta.
 */
export function SwordsLayer() {
  return (
    <div
      data-layer="swords"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-50 h-[44%] translate-y-full"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 32%, black 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 32%, black 100%)",
      }}
    >
      <Image
        src={throneArt}
        alt=""
        fill
        sizes="100vw"
        className="scale-125 object-cover object-bottom"
      />
      {/* Primeiro plano lê como silhueta: quase preto, sem detalhe. */}
      <div className="bg-void/70 absolute inset-0" />
      <div className="from-void to-void/20 absolute inset-0 bg-gradient-to-t" />
    </div>
  );
}
