"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * Abertura do site.
 *
 * Serve a dois propósitos, e o segundo é o que justifica o custo: além da
 * dramaticidade, ele segura a página enquanto as artes do hero chegam. Sem
 * isso o visitante via a cena aparecer em pedaços — foi o pop-in que atrapalhou
 * a verificação desta página a sessão inteira.
 *
 * O progresso é o real: conta as imagens marcadas com `data-hero-preload` que
 * já terminaram de carregar. Não é uma barra falsa rodando por tempo.
 *
 * Trava de segurança: se as imagens demorarem demais (rede ruim, otimizador
 * frio), o preloader sai sozinho em 6 segundos. Nunca prender a página.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const counter = { value: 0 };
      const label = root.current?.querySelector<HTMLElement>("[data-count]");

      /**
       * O hero pode ter vídeo ou imagem (movimento reduzido troca um pelo
       * outro), então o progresso conta os dois. Para vídeo, `readyState >= 3`
       * significa que já dá para tocar sem engasgar — esperar o arquivo
       * inteiro seguraria a cortina por megabytes à toa.
       */
      const heroMedia = () =>
        Array.from(
          document.querySelectorAll<HTMLImageElement | HTMLVideoElement>(
            "[data-hero-preload] img, [data-hero-preload] video",
          ),
        );

      const isReady = (el: HTMLImageElement | HTMLVideoElement) =>
        el instanceof HTMLVideoElement
          ? // HAVE_CURRENT_DATA: já existe um quadro para mostrar. Exigir
            // HAVE_FUTURE_DATA travava a cortina, porque os vídeos carregam
            // com `preload="metadata"` e só passam desse ponto tocando.
            el.readyState >= 2
          : el.complete && el.naturalWidth > 0;

      const loadedRatio = () => {
        const media = heroMedia();
        if (!media.length) return 0;
        return media.filter(isReady).length / media.length;
      };

      const open = () => {
        gsap
          .timeline({ onComplete: () => setDone(true) })
          .to("[data-preload-eye]", {
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
          })
          .to("[data-count]", { opacity: 0, duration: 0.4 }, "<")
          .to(
            "[data-curtain]",
            {
              scaleY: 0,
              duration: 1.1,
              ease: "power4.inOut",
              stagger: { each: 0.08, from: "center" },
              transformOrigin: "50% 0%",
            },
            "-=0.2",
          );
      };

      // Pulso dos olhos enquanto espera.
      gsap.to("[data-preload-eye]", {
        opacity: 0.35,
        duration: 1.1,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // O contador persegue o carregamento real, nunca voltando atrás.
      const ticker = gsap.to(counter, {
        value: 100,
        duration: 4,
        ease: "none",
        modifiers: {
          // Precisa devolver número: um modifier que devolve string quebra a
          // interpolação da tween.
          value: (raw: number) => Math.min(raw, loadedRatio() * 100),
        },
        onUpdate: () => {
          if (label) label.textContent = String(Math.round(counter.value));
        },
      });

      let opened = false;
      const release = () => {
        if (opened) return;
        opened = true;
        window.clearInterval(poll);
        window.clearTimeout(hardStop);
        ticker.kill();
        if (label) label.textContent = "100";
        open();
      };

      // Trava dura em `setTimeout`, não em `gsap.delayedCall`: se o ticker do
      // GSAP for perturbado (aba em segundo plano, main thread engasgada), o
      // delayedCall não dispara e a cortina fica presa para sempre. O timer do
      // navegador não depende disso.
      const hardStop = window.setTimeout(release, 4000);

      const poll = window.setInterval(() => {
        if (loadedRatio() >= 1) release();
      }, 120);

      return () => {
        window.clearInterval(poll);
        window.clearTimeout(hardStop);
      };
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[200]"
      aria-hidden="true"
      role="presentation"
    >
      {/* Cortina em cinco faixas que sobem escalonadas a partir do centro. */}
      <div className="absolute inset-0 flex">
        {[0, 1, 2, 3, 4].map((strip) => (
          <div key={strip} data-curtain className="bg-abyss h-full flex-1" />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-16">
        <div className="flex gap-14">
          {[0, 1].map((eye) => (
            <span
              key={eye}
              data-preload-eye
              className="bg-blood h-3 w-3 rounded-full"
              style={{ boxShadow: "0 0 28px 8px rgba(228,35,44,0.65)" }}
            />
          ))}
        </div>

        <p className="display text-parchment/25 text-6xl md:text-8xl">
          <span data-count>0</span>
        </p>
      </div>
    </div>
  );
}
