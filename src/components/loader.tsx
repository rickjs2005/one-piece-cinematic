"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { SvgWord } from "./svg-word";

/**
 * Tempo mínimo de tela preta, mesmo com tudo em cache.
 *
 * 3.3s, não 0.9: o desenho da marca leva ~2.6s (1.6 de traço + stagger de 8
 * letras), o risco vermelho fecha aos ~2.75 e o nome riscado precisa de um
 * respiro (~0.5s) pra registrar antes do portão abrir. Com 0.9 o portão
 * abria no meio do gesto e ninguém via a marca — visto em captura. A
 * abertura É o momento; segurar aqui compra a primeira impressão inteira.
 */
const MIN_HOLD = 3.3;

/**
 * O portão.
 *
 * Segura o escuro enquanto o hero (WebGL/vídeo) chega, e a marca se desenha
 * em estêncil por cima — dourado sobre carvão, o mesmo gesto que o título de
 * cada capítulo usa mais adiante (`.ch-letter`), só que aqui é a primeira vez
 * que aparece. O traço mede o glifo (não há `getTotalLength` em `<text>`) e
 * entra por vários pontos ao mesmo tempo: lê como estêncil sendo pintado, não
 * como um contador enchendo. No fim, uma pincelada vermelha atravessa o nome
 * — o gesto da marca original da obra — e só então o portão abre.
 *
 * Regra de ouro: portão nenhum pode virar parede. Se a GPU falhar, o
 * `sceneReady` chega por timeout no shell e o site abre do mesmo jeito.
 */
export function Loader({ sceneReady, onDone }: { sceneReady: boolean; onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const slash = useRef<SVGPathElement>(null);
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
      .to([".loader-mark", ".loader-slash"], { opacity: 0, duration: 0.3 }, 0.1)
      .to(".loader", { opacity: 0, duration: 0.4, ease: "power2.inOut" }, 0.25);
    return () => {
      tl.kill();
    };
  }, [sceneReady, held, gone, onDone]);

  if (gone) return null;

  return (
    <div ref={root}>
      <div className="loader flex-col gap-[1.8rem]">
        <div className="relative w-[min(72vw,32rem)] px-6">
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

              // A pincelada só entra DEPOIS que o nome assentou — riscar um
              // nome pela metade não diz nada. Path de verdade, então aqui o
              // getTotalLength existe e o traço desenha da esquerda pra
              // direita como um golpe.
              const stroke = slash.current;
              if (stroke) {
                const len = stroke.getTotalLength();
                // autoAlpha 0 além do dash: com linecap redondo, o offset
                // cheio ainda deixa a "cabeça" do traço visível — um pingo
                // vermelho parado na tela antes da hora (visto em captura).
                gsap.set(stroke, {
                  strokeDasharray: len,
                  strokeDashoffset: len,
                  autoAlpha: 0,
                });
                gsap.to(stroke, {
                  autoAlpha: 0.9,
                  duration: 0.04,
                  delay: 2.25,
                });
                gsap.to(stroke, {
                  strokeDashoffset: 0,
                  duration: 0.5,
                  delay: 2.25,
                  ease: "power3.in",
                });
              }
            }}
          />
          {/* O risco vermelho da marca — atravessa o nome em diagonal, como a
              pincelada do logo original. `preserveAspectRatio="none"` porque
              ele acompanha a CAIXA do nome, não uma proporção própria. */}
          <svg
            aria-hidden
            className="loader-slash pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 1000 220"
            preserveAspectRatio="none"
          >
            <path
              ref={slash}
              d="M 28 176 Q 480 128 972 44"
              fill="none"
              stroke="var(--color-blood)"
              strokeWidth="13"
              strokeLinecap="round"
              opacity="0.9"
            />
          </svg>
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
