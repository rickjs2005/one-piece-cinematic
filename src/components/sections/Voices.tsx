"use client";

import { VOICES } from "@/content/voices";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Mural de falas — as vozes de fora da tripulação que empurraram a história.
 *
 * A fala é o elemento visual da seção: tipografia grande em display, sem
 * ilustração competindo com ela. As falas dos tripulantes vivem nos cards de
 * `Crew` e não se repetem aqui.
 */
export function Voices() {
  return (
    <section
      className="relative px-6 py-32 md:px-16"
      aria-label="Falas marcantes"
    >
      <Reveal className="mx-auto mb-20 max-w-5xl">
        <span className="label-caps text-crimson">O que ficou</span>
        <h2 className="font-display mt-3 text-[clamp(2rem,5vw,4rem)] leading-none">
          Falas Marcantes
        </h2>
      </Reveal>

      <div className="mx-auto grid max-w-5xl gap-px md:grid-cols-2">
        {VOICES.map((voice, index) => (
          <Reveal
            key={voice.id}
            delay={(index % 2) * 0.06}
            className="border-mist/12 group h-full border p-8 md:p-10"
          >
            <figure className="flex h-full flex-col">
              <span
                className="font-display text-crimson/30 text-6xl leading-none select-none"
                aria-hidden="true"
              >
                “
              </span>

              <blockquote className="-mt-4">
                <p className="font-display text-[clamp(1.5rem,2.6vw,2.25rem)] leading-tight">
                  {voice.quote}
                </p>
              </blockquote>

              <figcaption className="mt-auto pt-8">
                <p className="label-caps text-gold">{voice.speaker}</p>
                <p className="text-mist mt-1 text-sm">{voice.context}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
