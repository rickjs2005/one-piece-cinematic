"use client";

import { VOICES } from "@/content/voices";
import { Reveal } from "@/components/ui/Reveal";
import { ParallaxBackdrop } from "@/components/ui/ParallaxBackdrop";
import ocean from "../../../public/art/ocean.webp";

/**
 * Mural de falas — as vozes de fora da tripulação que empurraram a história.
 *
 * A fala é o elemento visual da seção: tipografia grande, sem ilustração
 * competindo com ela. As falas dos tripulantes vivem nos cards de `Crew` e não
 * se repetem aqui.
 */
export function Voices() {
  return (
    <section
      className="relative overflow-hidden px-6 py-32 md:px-16"
      aria-label="Falas marcantes"
    >
      <ParallaxBackdrop src={ocean} opacity={0.3} />

      <Reveal className="relative z-10 mx-auto mb-20 max-w-6xl">
        <span className="label-caps text-blood">O que ficou</span>
        <h2 className="display mt-4 text-[clamp(2.5rem,8vw,7rem)]">
          Falas <span className="text-hollow">Marcantes</span>
        </h2>
      </Reveal>

      <div className="relative z-10 mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
        {VOICES.map((voice, index) => (
          <Reveal
            key={voice.id}
            delay={(index % 2) * 0.06}
            className="bg-deep/70 ring-parchment/10 hover:ring-blood/50 h-full p-8 ring-1 backdrop-blur-sm transition-colors duration-500 md:p-10"
          >
            <figure className="flex h-full flex-col">
              <blockquote>
                {/* Entrelinha folgada: são falas de duas a três linhas, e a
                    entrelinha de pôster só funciona em uma linha só. */}
                <p className="display text-[clamp(1.6rem,3.2vw,2.6rem)] leading-[1.08]">
                  {voice.quote}
                </p>
              </blockquote>

              <figcaption className="mt-auto pt-8">
                <p className="label-caps text-gold">{voice.speaker}</p>
                <p className="text-fog mt-1.5 text-sm">{voice.context}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
