"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { SvgWord } from "./svg-word";

/** Tempo mínimo de tela preta, mesmo com tudo em cache. */
const MIN_HOLD = 0.9;

/**
 * O portão.
 *
 * Segura o escuro enquanto o hero (WebGL/vídeo) chega, e a marca se desenha
 * em estêncil por cima — dourado sobre carvão, o mesmo gesto que o título de
 * cada capítulo usa mais adiante (`.ch-letter`), só que aqui é a primeira vez
 * que aparece. O traço mede o glifo (não há `getTotalLength` em `<text>`) e
 * entra por vários pontos ao mesmo tempo: lê como estêncil sendo pintado, não
 * como um contador enchendo.
 *
 * Regra de ouro: portão nenhum pode virar parede. Se a GPU falhar, o
 * `sceneReady` chega por timeout no shell e o site abre do mesmo jeito.
 */
export function Loader({ sceneReady, onDone }: { sceneReady: boolean; onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const [held, setHeld] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) {
      setGone(true);
      onDone();
      return;
    }
    // A barra avança até 88% por conta própria: o resto só quando a cena
    // avisa. Barra que chega a 100% e fica esperando mente pro usuário.
    gsap.fromTo(
      ".loader-bar",
      { scaleX: 0 },
      { scaleX: 0.88, duration: 2.2, ease: "power2.out" },
    );
    gsap.fromTo(
      ".loader-note",
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.25 },
    );
    const timer = window.setTimeout(() => setHeld(true), MIN_HOLD * 1000);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  useEffect(() => {
    if (!sceneReady || !held || gone || reduced.current) return;
    const tl = gsap.timeline({
      onComplete: () => {
        setGone(true);
        onDone();
      },
    });
    tl.to(".loader-bar", { scaleX: 1, duration: 0.35, ease: "power2.inOut" })
      .to(".loader-note", { opacity: 0, duration: 0.3 }, 0.1)
      .to(".loader-mark", { opacity: 0, duration: 0.3 }, 0.1)
      .to(".loader", { opacity: 0, duration: 0.4, ease: "power2.inOut" }, 0.25);
    return () => {
      tl.kill();
    };
  }, [sceneReady, held, gone, onDone]);

  if (gone) return null;

  return (
    <div ref={root}>
      <div className="loader flex-col gap-[1.8rem]">
        <div className="w-[min(72vw,32rem)] px-6">
          <h1 className="sr-only">ONE PIECE</h1>
          <SvgWord
            text="ONE PIECE"
            tracking={0.03}
            letterClassName="loader-mark"
            onLayout={(letters) => {
              // Mesma matemática do título de capítulo (`ch-letter`): mede o
              // glifo pela largura computada, já que <text> não expõe
              // getTotalLength().
              for (const letter of letters) {
                const len = letter.getComputedTextLength() * 3.2;
                gsap.set(letter, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 });
              }
              gsap.to(letters, {
                strokeDashoffset: 0,
                fillOpacity: 1,
                duration: 1.6,
                stagger: 0.12,
                ease: "power2.inOut",
              });
            }}
          />
        </div>
        <p className="loader-note t-micro text-[var(--color-gold)] opacity-0">
          A história que o mundo tentou apagar
        </p>
        <div className="loader-bar" />
      </div>
      <p className="sr-only" role="status">
        Carregando ONE PIECE
      </p>
    </div>
  );
}
