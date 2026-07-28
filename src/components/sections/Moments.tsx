"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MOMENTS } from "@/content/moments";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * A jornada: painel de cena fixo + texto rolando ao lado.
 *
 * Cada bloco de texto ocupa uma tela inteira e, ao entrar, troca a imagem do
 * painel fixo com um crossfade e um leve zoom-out. É o que transforma a
 * timeline de uma lista de parágrafos em uma sequência de planos.
 *
 * A versão anterior era só texto com uma linha vermelha ao lado — correta,
 * porém sem nada para olhar.
 *
 * Em telas pequenas o painel fixo não cabe: cada momento vira a sua própria
 * cena empilhada acima do texto. Em `prefers-reduced-motion` o layout é o
 * mesmo do mobile, sem troca automática.
 */
export function Moments() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const scenes = gsap.utils.toArray<HTMLElement>("[data-scene]");
          const blocks = gsap.utils.toArray<HTMLElement>("[data-moment]");
          if (!scenes.length) return;

          gsap.set(scenes[0], { opacity: 1 });

          blocks.forEach((block, index) => {
            ScrollTrigger.create({
              trigger: block,
              // Ativa enquanto o bloco cruza o CENTRO da viewport. Com uma
              // linha em 60% a janela ficava estreita: blocos mais baixos que
              // a tela entravam e saíam de atividade quase juntos, e o painel
              // ficava mostrando a cena de um momento que não era o lido.
              start: "top center",
              end: "bottom center",
              onToggle: (self) => {
                if (!self.isActive) return;

                gsap.to(scenes, {
                  opacity: 0,
                  duration: 0.55,
                  overwrite: "auto",
                });
                gsap.to(scenes[index], {
                  opacity: 1,
                  duration: 0.55,
                  overwrite: "auto",
                });
                // Zoom-out lento a cada troca: dá vida ao plano parado.
                gsap.fromTo(
                  scenes[index],
                  { scale: 1.14 },
                  {
                    scale: 1,
                    duration: 1.8,
                    ease: "power2.out",
                    overwrite: "auto",
                  },
                );
              },
            });

            gsap.from(block.querySelector("[data-moment-body]"), {
              opacity: 0,
              y: 40,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: { trigger: block, start: "top 72%", once: true },
            });
          });
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative px-6 py-28 md:px-16"
      aria-label="A jornada"
    >
      <header className="mx-auto mb-16 max-w-6xl">
        <span className="label-caps text-blood">
          De Loguetown até o fim do mapa
        </span>
        <h2 className="display mt-4 text-[clamp(2.5rem,8vw,7rem)]">
          A <span className="text-hollow">Jornada</span>
        </h2>
      </header>

      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.2fr_1fr] md:gap-14">
        {/* Painel fixo — só existe no desktop. */}
        <div className="hidden md:block">
          <div className="sticky top-[12svh] aspect-[3/2] w-full overflow-hidden">
            {MOMENTS.map((moment, index) => (
              <div
                key={`scene-${moment.title}`}
                data-scene
                className="absolute inset-0 opacity-0"
              >
                <Image
                  src={moment.scene}
                  alt={`${moment.title} — ${moment.place}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="from-abyss/70 absolute inset-0 bg-gradient-to-t to-transparent" />
                <div className="ring-parchment/10 absolute inset-0 ring-1 ring-inset" />
                <span className="display text-parchment absolute bottom-5 left-6 text-6xl opacity-80">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna de texto. */}
        <ol>
          {MOMENTS.map((moment) => (
            <li
              key={moment.title}
              data-moment
              className="flex min-h-[78svh] flex-col justify-center py-10 md:min-h-[85svh]"
            >
              {/* Cena empilhada: substitui o painel fixo no mobile. */}
              <div className="relative mb-7 aspect-[3/2] w-full overflow-hidden md:hidden">
                <Image
                  src={moment.scene}
                  alt={`${moment.title} — ${moment.place}`}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="from-abyss/70 absolute inset-0 bg-gradient-to-t to-transparent" />
              </div>

              <div data-moment-body>
                <div className="flex flex-wrap items-baseline gap-x-4">
                  <span className="label-caps text-gold">{moment.marker}</span>
                  <span className="label-caps text-fog/60">{moment.place}</span>
                </div>
                <h3 className="display mt-3 text-4xl md:text-6xl">
                  {moment.title}
                </h3>
                <div className="bg-blood mt-5 mb-6 h-0.5 w-16" />
                <p className="text-parchment/75 max-w-xl text-lg leading-relaxed">
                  {moment.description}
                </p>
                {moment.ongoing && (
                  <p className="text-fog label-caps mt-6">
                    Ainda em curso na obra
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
