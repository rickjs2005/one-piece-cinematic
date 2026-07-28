"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CREW } from "@/content/crew";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * A tripulação, em galeria horizontal de pôsteres.
 *
 * O scroll vertical vira deslocamento horizontal. Como no hero, o palco é
 * `sticky` em vez de um pin do ScrollTrigger — sem pin-spacer e sem risco de
 * empurrar o resto da página se a medição sair errada.
 *
 * Cada retrato tem um parallax interno próprio: a imagem desliza no eixo X ao
 * contrário da trilha, então os cards não parecem um filmstrip rígido. É esse
 * segundo eixo que dá profundidade à galeria.
 *
 * Em `prefers-reduced-motion` a trilha vira uma lista com scroll horizontal
 * comum, que o usuário controla no próprio ritmo.
 */
export function Crew() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const track = root.current?.querySelector<HTMLElement>("[data-track]");
        if (!track) return;

        const scroller = ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
          animation: gsap.to(track, {
            // Função em vez de valor fixo: recalculado a cada refresh, então
            // girar o celular ou redimensionar não quebra o fim da trilha.
            x: () => -(track.scrollWidth - window.innerWidth),
            ease: "none",
          }),
        });

        // Recompensas contando de zero até o valor. É um número absurdo, e
        // vê-lo subir vende o tamanho dele melhor do que lê-lo parado.
        gsap.utils.toArray<HTMLElement>("[data-bounty]").forEach((el, i) => {
          const target = Number(el.dataset.value ?? 0);
          const counter = { value: 0 };

          gsap.to(counter, {
            value: target,
            duration: 1.8,
            delay: i * 0.06,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = Math.round(counter.value).toLocaleString(
                "pt-BR",
              );
            },
            scrollTrigger: {
              trigger: root.current,
              start: "top 70%",
              once: true,
            },
          });
        });

        // Parallax interno dos retratos, no sentido contrário à trilha.
        gsap.utils.toArray<HTMLElement>("[data-portrait]").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: root.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
              },
            },
          );
        });

        return () => scroller.kill();
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative h-[560svh] motion-reduce:h-auto"
      aria-label="Os Piratas do Chapéu de Palha"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden motion-reduce:static motion-reduce:h-auto motion-reduce:py-24">
        <header className="mb-8 px-6 md:px-16">
          <span className="label-caps text-blood">Dez pessoas, dez sonhos</span>
          <h2 className="display mt-4 text-[clamp(2.5rem,8vw,7rem)]">
            Os Chapéus <span className="text-hollow">de Palha</span>
          </h2>
        </header>

        <div
          data-track
          className="flex w-max gap-5 px-6 md:px-16 motion-reduce:w-auto motion-reduce:overflow-x-auto"
        >
          {CREW.map((mate, index) => (
            <article
              key={mate.id}
              className="group relative aspect-[4/5] w-[78vw] shrink-0 overflow-hidden sm:w-[340px]"
            >
              <div data-portrait className="absolute inset-0 scale-115">
                <Image
                  src={mate.portrait}
                  alt={`${mate.name}, ${mate.role.toLowerCase()} dos Chapéus de Palha`}
                  fill
                  sizes="(max-width: 640px) 78vw, 340px"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Degradê que segura o texto sem apagar o rosto. */}
              <div className="from-abyss via-abyss/60 absolute inset-0 bg-gradient-to-t to-transparent" />
              <div className="ring-parchment/10 group-hover:ring-blood/60 absolute inset-0 ring-1 transition-colors duration-500 ring-inset" />

              <span className="display text-parchment/12 absolute top-3 right-4 text-7xl select-none">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="label-caps text-gold">{mate.role}</span>
                <h3 className="display mt-2 text-3xl leading-none">
                  {mate.name}
                </h3>

                <p className="text-fog mt-3 text-sm leading-snug">
                  {mate.dream}
                </p>

                <blockquote className="border-blood mt-4 border-l-2 pl-3">
                  <p className="text-parchment text-sm leading-snug font-medium">
                    “{mate.quote}”
                  </p>
                </blockquote>

                <p className="text-fog/60 label-caps mt-4">
                  ฿{" "}
                  {/* O valor de partida no HTML é o número final: se o JS não
                      rodar, a recompensa continua correta na tela. */}
                  <span
                    data-bounty
                    data-value={mate.bounty.replaceAll(".", "")}
                  >
                    {mate.bounty}
                  </span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
