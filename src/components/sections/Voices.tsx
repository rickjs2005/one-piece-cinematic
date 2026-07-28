"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { VOICES, type Voice } from "@/content/voices";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * As falas marcantes, uma por tela.
 *
 * Cada fala é um plano cinematográfico: retrato grande de um lado, a frase em
 * corpo de cartaz do outro, alternando de lado a cada painel. A versão
 * anterior era uma grade de cartões de texto — correta, e sem nenhuma emoção.
 *
 * Três animações compõem a entrada de cada painel: o retrato é descoberto por
 * `clip-path` de baixo para cima enquanto faz um leve zoom-out, as palavras da
 * frase sobem escalonadas, e o brilho de acento cresce por trás do retrato.
 */

// Mapa explícito em vez de classe montada por template string: o Tailwind
// varre o código como texto e não enxergaria `text-${accent}`.
const ACCENT_TEXT: Record<Voice["accent"], string> = {
  gold: "text-gold",
  blood: "text-blood",
  ember: "text-ember",
  surf: "text-surf",
  orchid: "text-orchid",
  violet: "text-violet",
};

/**
 * O brilho de acento é um gradiente radial, não um `blur()`.
 *
 * A primeira versão usava `blur-3xl` sobre um bloco do tamanho do retrato.
 * Multiplicado por nove painéis, o custo de filtro deixava o renderizador
 * arrastado a ponto de não responder. Um radial-gradient dá o mesmo halo sem
 * passar pelo pipeline de filtros.
 */
const ACCENT_GLOW: Record<Voice["accent"], string> = {
  gold: "[background:radial-gradient(ellipse_at_center,rgba(245,183,64,0.28),transparent_70%)]",
  blood:
    "[background:radial-gradient(ellipse_at_center,rgba(228,35,44,0.28),transparent_70%)]",
  ember:
    "[background:radial-gradient(ellipse_at_center,rgba(255,90,60,0.28),transparent_70%)]",
  surf: "[background:radial-gradient(ellipse_at_center,rgba(53,194,232,0.26),transparent_70%)]",
  orchid:
    "[background:radial-gradient(ellipse_at_center,rgba(224,87,176,0.28),transparent_70%)]",
  violet:
    "[background:radial-gradient(ellipse_at_center,rgba(139,108,240,0.30),transparent_70%)]",
};

const ACCENT_BAR: Record<Voice["accent"], string> = {
  gold: "bg-gold",
  blood: "bg-blood",
  ember: "bg-ember",
  surf: "bg-surf",
  orchid: "bg-orchid",
  violet: "bg-violet",
};

export function Voices() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-voice]").forEach((panel) => {
          const enter = { trigger: panel, start: "top 65%", once: true };

          gsap.fromTo(
            panel.querySelector("[data-voice-portrait]"),
            { clipPath: "inset(100% 0 0 0)" },
            {
              clipPath: "inset(0% 0 0 0)",
              duration: 1.3,
              ease: "power3.out",
              scrollTrigger: enter,
            },
          );

          gsap.fromTo(
            panel.querySelector("[data-voice-img]"),
            { scale: 1.22 },
            {
              scale: 1,
              duration: 1.9,
              ease: "power2.out",
              scrollTrigger: enter,
            },
          );

          gsap.fromTo(
            panel.querySelector("[data-voice-glow]"),
            { opacity: 0, scale: 0.7 },
            {
              opacity: 1,
              scale: 1,
              duration: 1.8,
              ease: "power2.out",
              scrollTrigger: enter,
            },
          );

          gsap.fromTo(
            panel.querySelectorAll("[data-voice-word]"),
            { opacity: 0, yPercent: 70 },
            {
              opacity: 1,
              yPercent: 0,
              duration: 0.85,
              stagger: 0.045,
              ease: "power3.out",
              scrollTrigger: enter,
            },
          );

          gsap.fromTo(
            panel.querySelector("[data-voice-bar]"),
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1,
              ease: "power3.out",
              transformOrigin: "0% 50%",
              scrollTrigger: enter,
            },
          );

          gsap.fromTo(
            panel.querySelector("[data-voice-meta]"),
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              delay: 0.25,
              ease: "power2.out",
              scrollTrigger: enter,
            },
          );

          // Parallax lento do retrato durante toda a passagem do painel.
          gsap.fromTo(
            panel.querySelector("[data-voice-img]"),
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative"
      aria-label="Falas marcantes"
    >
      <header className="mx-auto max-w-7xl px-6 pt-32 pb-8 md:px-16">
        <span className="label-caps text-blood">O que ficou</span>
        <h2 className="display mt-4 text-[clamp(2.5rem,8vw,7rem)]">
          Falas <span className="text-hollow">Marcantes</span>
        </h2>
        <p className="text-fog mt-6 max-w-xl leading-relaxed">
          Nove frases que sobreviveram aos arcos em que foram ditas.
        </p>
      </header>

      {VOICES.map((voice, index) => {
        const imageFirst = index % 2 === 0;

        return (
          <article
            key={voice.id}
            data-voice
            className="relative flex min-h-[100svh] items-center px-6 py-16 md:px-16"
          >
            <div className="mx-auto grid w-full max-w-7xl items-center gap-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] md:gap-16">
              {/* Retrato */}
              {/* A largura é derivada da ALTURA disponível: um 4/5 ocupando a
                  coluna inteira fica mais alto que a viewport e o retrato
                  passa do rodapé. Limitando a largura a 62svh × 4/5, o painel
                  inteiro cabe em uma tela em qualquer proporção. */}
              <div
                className={`relative mx-auto w-full max-w-[calc(62svh*0.8)] ${imageFirst ? "" : "md:order-2"}`}
              >
                <div
                  data-voice-glow
                  className={`pointer-events-none absolute -inset-24 ${ACCENT_GLOW[voice.accent]}`}
                />
                <div
                  data-voice-portrait
                  className="relative aspect-[4/5] w-full overflow-hidden"
                >
                  <div data-voice-img className="absolute inset-0">
                    <Image
                      src={voice.portrait}
                      alt={`${voice.speaker} — ${voice.context}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="from-abyss/60 absolute inset-0 bg-gradient-to-t to-transparent" />
                  <div className="ring-parchment/10 absolute inset-0 ring-1 ring-inset" />
                </div>
              </div>

              {/* Fala */}
              <div className={imageFirst ? "" : "md:order-1"}>
                <span
                  className={`display block text-5xl md:text-7xl ${ACCENT_TEXT[voice.accent]} opacity-30`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <blockquote className="mt-5">
                  {voice.lead && (
                    <p className="display text-parchment/45 mb-3 text-[clamp(1.1rem,2.3vw,2.1rem)] leading-[1.1]">
                      {voice.lead.split(" ").map((word, wordIndex) => (
                        <span
                          key={`lead-${word}-${wordIndex}`}
                          className="mr-[0.22em] inline-block overflow-hidden"
                        >
                          <span data-voice-word className="inline-block">
                            {word}
                          </span>
                        </span>
                      ))}
                    </p>
                  )}
                  <p className="display text-[clamp(2rem,4.6vw,4.5rem)] leading-[1.03]">
                    {voice.quote.split(" ").map((word, wordIndex) => (
                      // O espaço vai como margem: dentro de um `inline-block`
                      // o espaço em branco colapsa e as palavras grudam.
                      <span
                        key={`${word}-${wordIndex}`}
                        className="mr-[0.22em] inline-block overflow-hidden"
                      >
                        <span data-voice-word className="inline-block">
                          {word}
                        </span>
                      </span>
                    ))}
                  </p>
                </blockquote>

                <div
                  data-voice-bar
                  className={`mt-8 h-1 w-24 ${ACCENT_BAR[voice.accent]}`}
                />

                <div data-voice-meta className="mt-7">
                  <p
                    className={`label-caps text-base ${ACCENT_TEXT[voice.accent]}`}
                  >
                    {voice.speaker}
                  </p>
                  <p className="text-fog mt-2">{voice.context}</p>
                  <p className="text-parchment/60 mt-5 hidden max-w-md leading-relaxed md:block">
                    {voice.weight}
                  </p>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
