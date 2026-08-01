"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef, useState } from "react";
import { CHAPTERS, NEUTRAL_NAV, type Chapter } from "@/content/chapters";
import { setNavColor } from "@/lib/nav-color";
import { splitText } from "@/lib/split";
import { SvgWord } from "./svg-word";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);

/* --------------------------------------------------------------------------
   Geometria da faixa. Os três painéis somam 380vw e a seção fica fixada
   enquanto eles passam.

     100vw  abertura — o nome se desenha, o numeral chega
     150vw  miolo editorial — manchete + cluster de fotos com parallax
     130vw  mídia em sangria — mais larga que a tela DE PROPÓSITO, pra sobrar
            deslocamento e a foto poder deslizar depois de abrir

   PRE é a coreografia que acontece com a faixa PARADA, antes do horizontal
   começar. PAUSE é o miolo do movimento onde a faixa PARA DE NOVO enquanto o
   clip-path abre a foto de letterbox pra sangria total.

   Essa parada no meio é o gesto mais característico da referência: sem ela o
   capítulo lê como uma esteira; com ela lê como alguém dirigindo o olho.
   -------------------------------------------------------------------------- */
const PRE = 2200; // px de scroll de coreografia parada
const PAUSE = 1300; // px de scroll com o horizontal congelado

/**
 * Fração do horizontal já percorrida quando a faixa congela — FALLBACK.
 *
 * Não é número redondo por acaso: pra um capítulo SEM painel extra a faixa
 * tem 380vw e a tela 100vw, então o curso total é 280vw. O painel de mídia
 * ocupa de 250vw a 380vw, ou seja, ele cobre a tela inteira a partir de
 * 250vw de curso — 250/280 = 0,893. Essa constante existia porque 0,90
 * aproxima esse valor com uma pequena folga.
 *
 * Só que capítulos com painel extra (tripulacao, rota, guerras) somam 480vw,
 * não 380vw — o painel de mídia só começa em 350vw e o curso vira 380vw, ou
 * seja o split real é 350/380 ≈ 0,923, bem longe do 0,90 cravado. Com o
 * valor fixo, a pausa chegava CEDO DEMAIS nesses capítulos: o clip-path
 * abria e a foto entrava em tela cheia antes do painel de mídia de fato
 * estar lá — a "pausa" caía sobre o painel extra ou sobre o fim do
 * corredor, não sobre a mídia.
 *
 * Por isso o split abaixo é MEDIDO (`mediaPanel.offsetLeft / overflow`) e
 * não mais cravado — esta constante só sobra como fallback caso o seletor
 * não encontre `.panel-media` (não deveria acontecer, mas evita dividir por
 * um valor incoerente) e como registro do número histórico.
 */
const SPLIT = 0.9;

/** px de scroll -> "segundos" de timeline. Mantém o scrub uniforme. */
const px = (n: number) => n / 1000;

const CLOSED = "polygon(26% 36%, 74% 36%, 74% 58%, 26% 58%)";
const OPEN = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

/* --------------------------------------------------------------------------
   AS CENAS — uma por capítulo, no nível do layout aprovado no molde original.

   Mesma gramática pra todas: um OBJETO real recortado pousado no campo (a
   espada, o chapéu, a bússola, a bandeira), um ORNAMENTO de tinta que se
   desenha (cada capítulo desenha o seu: chuva em diagonal, arcos de sol,
   ondas e bússola, calor subindo, o horizonte do amanhecer), uma ATMOSFERA
   (névoa, feixes, brasas), o bloco poético e o índice da jornada. Tudo
   dirigido pela MESMA timeline do capítulo — as classes
   .ch-flourish/.x-cup/.x-bean são alvos dela; nada aqui tem ScrollTrigger
   próprio.
   -------------------------------------------------------------------------- */

type SceneSpec = {
  /** traços do ornamento (viewBox 1200×600) */
  strokes: string[];
  /** recorte principal e onde ele pousa */
  obj: { src: string; style: React.CSSProperties };
  /** vapor sobre o objeto (nenhum capítulo usa por ora) */
  steam?: boolean;
  /** recortes desfocados na frente da lente */
  fore: { src: string; style: React.CSSProperties }[];
  /** atmosfera extra */
  air?: "mist" | "rays" | "embers" | "grounds";
  /** bloco poético */
  block: { side: "left" | "right"; icon: string; copy: React.ReactNode };
  /**
   * Diálogo encenado no centro-baixo do painel de abertura — só a EXECUÇÃO
   * usa: a pergunta da multidão e a resposta que abriu a era. Entra pela
   * timeline quando o título do capítulo se dissolve (segunda batida da
   * abertura: nome → fala).
   */
  dialogo?: { pergunta: string; resposta: string; quem: string };
};

/** ícones de traço (paths 24×24) — os mesmos glifos do índice da nav */
const GLYPHS: Record<string, string[]> = {
  execucao: ["M4 20 L15 9", "M13 7 L18 2 L22 6 L17 11", "M7 15 L11 19"],
  tripulacao: ["M3 15h18", "M7 15a5 5 0 0 1 10 0", "M7 13h10"],
  rota: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z", "M15.5 8.5 13 13l-4.5 2.5L11 11Z"],
  guerras: ["M6 3v18", "M6 4h11l-2.5 3 2.5 3H6"],
  amanhecer: ["M3 17h18", "M7 17a5 5 0 0 1 10 0", "M12 6v2.5M5.6 8.6l1.8 1.8M18.4 8.6l-1.8 1.8"],
};

/** o recorte-vinheta reutilizável nas cinco cenas — o chapéu de palha */
const HAT = "/shot/cutout/hat.webp";

const SCENES: Record<string, SceneSpec> = {
  execucao: {
    // chuva fina caindo em diagonal + a plataforma do cadafalso
    strokes: [
      "M300,0 L180,600",
      "M700,0 L580,600",
      "M1050,0 L930,600",
      "M420,470 h360 M480,470 L480,300 h240 L720,470",
    ],
    obj: { src: "/shot/cutout/sword.webp", style: { left: "4vw", bottom: "-2vh", width: "24rem", transform: "rotate(8deg)" } },
    fore: [
      { src: HAT, style: { right: "10%", top: "8%", width: "8rem", filter: "blur(10px)", transform: "rotate(-18deg)" } },
      { src: HAT, style: { right: "-2%", top: "60%", width: "10rem", filter: "blur(7px)", transform: "rotate(140deg)" } },
    ],
    air: "mist",
    block: {
      side: "right",
      icon: "execucao",
      copy: (
        <>
          Tudo termina numa praça e começa na mesma praça. A morte dele foi{" "}
          <em className="voice">um convite</em> — e o mundo inteiro aceitou.
        </>
      ),
    },
    // A resposta é a mesma fala canônica da vitrine (voices.ts) — uma voz
    // só no site inteiro, acrescida do "deixei tudo lá" do cadafalso.
    dialogo: {
      pergunta: "— O One Piece… o tesouro dele existe mesmo?!",
      resposta:
        "Minhas riquezas? Se quiserem, podem pegar. Procurem! Eu deixei tudo naquele lugar.",
      quem: "Gol D. Roger — e a Grande Era dos Piratas começou",
    },
  },
  tripulacao: {
    // arcos do sol a pino, com raios curtos
    strokes: [
      "M240,100 A420,420 0 0 1 960,100",
      "M340,150 A300,300 0 0 1 860,150",
      "M600,-10 L600,60",
      "M430,10 L455,72",
      "M770,10 L745,72",
      "M290,60 L335,110",
      "M910,60 L865,110",
    ],
    obj: { src: HAT, style: { right: "5vw", bottom: "-2vh", width: "26rem", transform: "rotate(-6deg)" } },
    fore: [
      { src: HAT, style: { left: "9%", top: "9%", width: "7rem", filter: "blur(9px)", transform: "rotate(-22deg)" } },
      { src: HAT, style: { left: "42%", top: "80%", width: "9.5rem", filter: "blur(6px)", transform: "rotate(55deg)" } },
    ],
    air: "rays",
    block: {
      side: "left",
      icon: "tripulacao",
      copy: (
        <>
          Ninguém aqui foi recrutado. Cada um foi{" "}
          <em className="voice">salvo</em> — e escolheu ficar.
        </>
      ),
    },
  },
  rota: {
    // duas ondas do mar + a bússola que enlouquece
    strokes: [
      "M0,420 C200,360 400,470 600,410 S1000,340 1200,400",
      "M0,500 C260,450 520,520 780,470 S1080,420 1200,460",
      "M950,140 a70,70 0 1 1 0.1,0",
      "M950,90 L950,140",
    ],
    obj: { src: "/shot/cutout/compass.webp", style: { left: "5vw", bottom: "-2vh", width: "24rem", transform: "rotate(-6deg)" } },
    fore: [
      { src: HAT, style: { right: "11%", top: "10%", width: "7.5rem", filter: "blur(9px)", transform: "rotate(-16deg)" } },
      { src: HAT, style: { right: "38%", top: "78%", width: "10rem", filter: "blur(6px)", transform: "rotate(24deg)" } },
    ],
    air: "mist",
    block: {
      side: "right",
      icon: "rota",
      copy: (
        <>
          A bússola comum enlouquece aqui. Só serve a que aponta{" "}
          <em className="voice">pro impossível</em>.
        </>
      ),
    },
  },
  guerras: {
    // calor subindo — três colunas de ar quente (fumaça de guerra)
    strokes: [
      "M220,540 C180,440 280,400 240,300 S280,180 240,90",
      "M610,560 C570,460 670,420 630,320 S670,200 630,110",
      "M990,540 C950,440 1050,400 1010,300 S1050,180 1010,90",
      "M420,520 C400,460 460,430 440,370",
      "M810,520 C790,460 850,430 830,370",
    ],
    obj: { src: "/shot/cutout/flag.webp", style: { left: "6vw", bottom: "6vh", width: "22rem", transform: "rotate(-4deg)" } },
    fore: [
      { src: HAT, style: { left: "12%", top: "8%", width: "7rem", filter: "blur(9px)", transform: "rotate(-36deg)" } },
      { src: HAT, style: { left: "34%", top: "76%", width: "10rem", filter: "blur(6px)", transform: "rotate(18deg)" } },
    ],
    air: "embers",
    block: {
      side: "right",
      icon: "guerras",
      copy: (
        <>
          Guerra, aqui, nunca é por ouro. É pelo direito de{" "}
          <em className="voice">hastear uma bandeira</em>.
        </>
      ),
    },
  },
  amanhecer: {
    // arcos de sol no horizonte + gaivotas
    strokes: [
      "M240,430 A420,420 0 0 1 960,430",
      "M340,470 A300,300 0 0 1 860,470",
      "M0,470 L1200,470",
      "M500,180 q30,-22 60,0 M560,180 q30,-22 60,0",
      "M640,220 q30,-22 60,0 M700,220 q30,-22 60,0",
    ],
    obj: { src: HAT, style: { right: "6vw", bottom: "-2vh", width: "22rem" } },
    steam: false,
    fore: [
      { src: HAT, style: { left: "13%", top: "6%", width: "7.5rem", filter: "blur(9px)", transform: "rotate(-24deg)" } },
      { src: HAT, style: { left: "46%", top: "78%", width: "10rem", filter: "blur(6px)", transform: "rotate(-60deg)" } },
    ],
    block: {
      side: "left",
      icon: "amanhecer",
      copy: (
        <>
          O tesouro tem dono e lugar. A resposta, não: ela chega{" "}
          <em className="voice">com quem chega junto</em>.
        </>
      ),
    },
  },
};

const INDEX = ["01", "02", "03", "04", "05"];

function ChapterScene({ chapter }: { chapter: Chapter }) {
  const scene = SCENES[chapter.key];
  if (!scene) return null;
  const accent = chapter.color.accent;

  return (
    // Desktop-only: a cena é composição de palco; empilhada no mobile ela
    // só atrapalharia a leitura.
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      {/* o ornamento, desenhado pela timeline POR CIMA das letras */}
      <svg className="ch-flourish z-[2]" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
        {scene.strokes.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>

      {/* atmosfera própria */}
      {scene.air === "mist" && (
        <>
          <div className="mist" style={{ top: "22%", "--mist-dur": "24s" } as React.CSSProperties} />
          <div className="mist" style={{ top: "58%", "--mist-dur": "32s" } as React.CSSProperties} />
        </>
      )}
      {scene.air === "rays" && <div className="sun-rays" />}
      {scene.air === "embers" &&
        [
          { left: "22%", top: "78%", dur: "5s", delay: "0s", peak: 0.7 },
          { left: "48%", top: "84%", dur: "6.5s", delay: "1.4s", peak: 0.6 },
          { left: "70%", top: "80%", dur: "5.5s", delay: "3s", peak: 0.65 },
          { left: "34%", top: "88%", dur: "7s", delay: "2.2s", peak: 0.5 },
          { left: "84%", top: "86%", dur: "6s", delay: "4.2s", peak: 0.55 },
        ].map((ember, i) => (
          <span
            key={i}
            className="mote"
            style={
              {
                left: ember.left,
                top: ember.top,
                width: "0.24rem",
                height: "0.24rem",
                "--mote-dur": ember.dur,
                "--mote-delay": ember.delay,
                "--mote-peak": ember.peak,
                "--mote-drift": "0.6rem",
              } as React.CSSProperties
            }
          />
        ))}
      {scene.air === "grounds" &&
        [
          { left: "30%", top: "18%", dur: "8s", delay: "0s" },
          { left: "52%", top: "10%", dur: "10s", delay: "2s" },
          { left: "68%", top: "22%", dur: "9s", delay: "4.5s" },
          { left: "42%", top: "30%", dur: "11s", delay: "1.2s" },
        ].map((grain, i) => (
          <span
            key={i}
            className="mote-fall"
            style={
              {
                left: grain.left,
                top: grain.top,
                width: "0.18rem",
                height: "0.18rem",
                "--mote-dur": grain.dur,
                "--mote-delay": grain.delay,
                "--mote-peak": 0.4,
              } as React.CSSProperties
            }
          />
        ))}

      {/* a marca no topo */}
      <div className="absolute top-[1.7rem] left-1/2 z-[3] flex -translate-x-1/2 flex-col items-center gap-[0.55rem]">
        <span className="block h-[0.55rem] w-[0.55rem] rotate-45" style={{ background: accent }} />
        <span className="t-micro ink-soft" style={{ letterSpacing: "0.34em" }}>
          One Piece
        </span>
      </div>

      {/* o bloco poético */}
      <div
        className={`absolute bottom-[13vh] z-[3] max-w-[24rem] ${
          scene.block.side === "left" ? "left-[6vw]" : "right-[6vw] text-right"
        }`}
      >
        <div
          className={`flex items-center gap-[0.8rem] ${scene.block.side === "right" ? "justify-end" : ""}`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke={accent}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-[1.1rem] w-[1.1rem]"
          >
            {GLYPHS[scene.block.icon].map((d) => (
              <path key={d} d={d} />
            ))}
          </svg>
          <p className="t-micro" style={{ color: accent }}>
            {chapter.kicker}
          </p>
        </div>
        <p className="t-body ink-soft mt-[1.1rem]">{scene.block.copy}</p>
      </div>

      {/* O diálogo do cadafalso — a segunda batida da abertura. Nasce
          invisível e a timeline o revela quando o título se dissolve; a
          posição centro-baixo não disputa com o bloco poético (direita) nem
          com o rótulo do numeral (esquerda). No reduced-motion o título não
          sai de cena, então o diálogo apenas coexiste embaixo. */}
      {scene.dialogo && (
        <div className="ch-dialogo absolute inset-x-0 bottom-[15vh] z-[3] mx-auto max-w-[30rem] text-center opacity-0">
          <p className="t-micro ink-soft">{scene.dialogo.pergunta}</p>
          <p
            className="voice mt-[0.85rem] text-[1.35rem] leading-[1.32]"
            style={{ color: accent }}
          >
            “{scene.dialogo.resposta}”
          </p>
          <p className="t-micro ink-faint mt-[0.85rem]">{scene.dialogo.quem}</p>
        </div>
      )}

      {/* o objeto da cena */}
      <div className="x-cup z-[2]" style={scene.obj.style}>
        {scene.steam && (
          <>
            <span className="steam-wisp" style={{ left: "30%", top: "-46%", "--steam-dur": "8s", "--steam-peak": 0.55 } as React.CSSProperties} />
            <span className="steam-wisp" style={{ left: "48%", top: "-58%", "--steam-dur": "11s", "--steam-delay": "2.5s", "--steam-peak": 0.4 } as React.CSSProperties} />
            <span className="steam-wisp" style={{ left: "16%", top: "-34%", "--steam-dur": "9.5s", "--steam-delay": "5s", "--steam-peak": 0.3 } as React.CSSProperties} />
          </>
        )}
        {/* img crua, não next/image: recorte com alpha, dimensão fluida e
            drop-shadow — o pipeline de otimização não ajuda aqui */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={scene.obj.src} alt="" loading="lazy" />
      </div>

      {/* recortes na frente da lente */}
      {scene.fore.map((item, i) => (
        <div key={i} className="x-bean z-[4]" style={{ ...item.style, width: undefined }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.src} alt="" loading="lazy" style={{ width: item.style.width }} />
        </div>
      ))}

      {/* o índice da jornada */}
      <div className="x-index z-[3]">
        {INDEX.map((n) =>
          n === chapter.index ? (
            <span
              key={n}
              className="t-micro t-nums grid h-[2.1rem] w-[2.1rem] place-items-center rounded-full border"
              style={{ color: accent, borderColor: `color-mix(in srgb, ${accent} 55%, transparent)` }}
            >
              {n}
            </span>
          ) : (
            <span key={n} className="t-micro ink-faint t-nums">
              {n}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

export function ChapterSection({
  chapter,
  first,
  extra,
}: {
  chapter: Chapter;
  first?: boolean;
  /** painel adicional de 100vw entre o corredor (painel 2) e a mídia (painel 3) */
  extra?: React.ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  const [titleReady, setTitleReady] = useState(false);
  const letters = useRef<SVGTextElement[]>([]);

  // O véu do fim do capítulo adota a cor de quem VEM — depois do último, a
  // página volta pro carvão das seções de produto.
  const at = CHAPTERS.findIndex((c) => c.key === chapter.key);
  const nextBg = CHAPTERS[at + 1]?.color.bg ?? "#05070d";

  useGSAP(
    () => {
      const section = root.current;
      if (!section || !titleReady) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const wide = window.matchMedia("(min-width: 992px)").matches;

      const q = gsap.utils.selector(section);
      const media = q(".ch-media")[0];
      const video = q("video")[0] as HTMLVideoElement | undefined;

      /**
       * Cola o src só quando a seção se aproxima. Sem isto, cinco vídeos em
       * sangria disputam banda no primeiro quadro da página.
       */
      const attachVideo = () => {
        if (!video?.dataset.src) return;
        video.src = video.dataset.src;
        delete video.dataset.src;
        video.load();
      };

      /** Autoplay pode ser recusado; o poster já cobre esse caso. */
      const playVideo = () => {
        video?.play().catch(() => {});
      };

      // Empilhado (mobile / sem movimento): sem pin, sem faixa. Cada bloco
      // entra por conta própria e o conteúdo continua todo lá.
      if (reduce || !wide) {
        gsap.set(media, { clipPath: "none" });
        gsap.set(q(".ch-stats"), { yPercent: 0, opacity: 1 });
        gsap.set(letters.current, { fillOpacity: 1, strokeDashoffset: 0 });
        gsap.set(q(".ch-digit"), { yPercent: 0 });
        // empilhado, o véu vira uma emenda estática entre as seções
        gsap.set(q(".chapter-veil"), { opacity: 1 });
        // a legenda do travelling não existe empilhada (é `hidden lg:block`),
        // mas sem movimento no desktop ela precisa nascer visível
        gsap.set([...q(".ch-headline"), ...q(".ch-leadbox")], { opacity: 1 });
        // idem o diálogo do cadafalso: sem timeline, nasce visível
        gsap.set(q(".ch-dialogo"), { opacity: 1 });

        // Sem movimento: fica no poster. Movimento é justamente o que a
        // pessoa pediu pra não ter.
        if (!reduce && video) {
          ScrollTrigger.create({
            trigger: video,
            start: "top bottom",
            end: "bottom top",
            onEnter: () => {
              attachVideo();
              playVideo();
            },
            onEnterBack: playVideo,
            onLeave: () => video.pause(),
            onLeaveBack: () => video.pause(),
          });
        }
        return;
      }

      const track = q(".chapter-track")[0] as HTMLElement;
      const overflow = track.scrollWidth - window.innerWidth;
      if (overflow <= 0) return;

      // O ponto do congelamento é MEDIDO, não cravado: `.panel-media` é filho
      // direto de `.chapter-track` (que tem `position: relative`, ver
      // globals.css), então `offsetLeft` é exatamente a largura acumulada de
      // tudo o que vem antes dele — 380vw sem extra, 480vw com. Dividido pelo
      // overflow real, isso dá o split exato pra QUALQUER combinação de
      // painéis, sem precisar prever cada largura na mão.
      const mediaPanel = q(".panel-media")[0] as HTMLElement | undefined;
      const split = mediaPanel ? Math.min(1, mediaPanel.offsetLeft / overflow) : SPLIT;
      const A = overflow * split;
      const B = overflow - A;
      const total = PRE + A + PAUSE + B;

      // Contorno estimado pela largura do glifo — <text> não expõe
      // getTotalLength(). O dash reinicia a cada contorno, então o traço
      // entra por vários pontos: lê como estêncil sendo pintado.
      for (const letter of letters.current) {
        const len = letter.getComputedTextLength() * 3.2;
        gsap.set(letter, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 });
      }
      gsap.set(media, { clipPath: CLOSED });

      // Vizinhos: ao sair, a nav já adota a cor de quem vem — assim ela
      // troca uma vez por transição, não duas.
      const nextColor = CHAPTERS[at + 1]?.color.nav ?? NEUTRAL_NAV;
      const prevColor = CHAPTERS[at - 1]?.color.nav ?? NEUTRAL_NAV;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${total}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: () => setNavColor(chapter.color.nav, chapter.key),
          onEnterBack: () => setNavColor(chapter.color.nav, chapter.key),
          onLeave: () => setNavColor(nextColor, CHAPTERS[at + 1]?.key ?? null),
          onLeaveBack: () => setNavColor(prevColor, CHAPTERS[at - 1]?.key ?? null),
          // Toca a partir do ponto em que o painel de mídia entra em cena, e
          // pausa ao voltar. Amarrado ao progresso (e não a um `.call()` na
          // timeline) porque com scrub o usuário atravessa o mesmo ponto nos
          // dois sentidos, e progresso funciona igual nos dois.
          onUpdate: (self) => {
            if (!video) return;
            const onScreen = self.progress > (PRE + A * 0.7) / total;
            if (onScreen && video.paused) playVideo();
            else if (!onScreen && !video.paused) video.pause();
          },
        },
      });

      // Pré-carga: começa a baixar quando a seção ainda está uma tela abaixo.
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        once: true,
        onEnter: attachVideo,
      });

      /* ---- 1. coreografia parada -------------------------------------- */
      tl.to(
        letters.current,
        {
          strokeDashoffset: 0,
          fillOpacity: 1,
          duration: px(900),
          stagger: px(150),
          ease: "power2.inOut",
        },
        0,
      )
        // os dígitos chegam de direções OPOSTAS — é o que impede o numeral
        // de parecer um contador e o faz parecer placar
        .fromTo(
          q(".ch-digit"),
          { yPercent: (i: number) => (i % 2 === 0 ? -125 : 125) },
          { yPercent: 0, duration: px(750), stagger: px(110), ease: "power3.out" },
          px(1050),
        )
        .fromTo(
          q(".ch-hero-label"),
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: px(600), ease: "power2.out" },
          px(1500),
        )
        .to(q(".ch-title"), { opacity: 0, duration: px(550), ease: "power2.in" }, px(1750));

      // A segunda batida da abertura: o nome sai, a FALA entra. Só existe
      // na EXECUÇÃO (o diálogo do cadafalso) — nos outros capítulos o
      // seletor volta vazio e nada acontece.
      if (q(".ch-dialogo").length) {
        tl.fromTo(
          q(".ch-dialogo"),
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: px(500), ease: "power2.out" },
          px(1900),
        );
      }

      /* ---- 1b. camadas da cena e paralaxe de fundo --------------------- */

      // Os arabescos se desenham como tinta, entrando por vários pontos.
      const flourish = q(".ch-flourish path") as unknown as SVGPathElement[];
      if (flourish.length) {
        for (const path of flourish) {
          const len = path.getTotalLength();
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        }
        tl.to(
          flourish,
          { strokeDashoffset: 0, duration: px(1500), stagger: px(140), ease: "power2.inOut" },
          px(350),
        );
      }

      // O objeto da cena pousa no campo um instante depois do nome.
      if (q(".x-cup").length) {
        tl.fromTo(
          q(".x-cup"),
          { y: "5rem", opacity: 0 },
          { y: 0, opacity: 1, duration: px(900), ease: "power3.out" },
          px(1100),
        );
      }

      // Recortes na frente da lente: a camada mais próxima anda MAIS que
      // todas as outras — é a regra do parallax de verdade (perto = rápido).
      (q(".x-bean") as HTMLElement[]).forEach((bean, i) => {
        tl.fromTo(
          bean,
          { y: `${4 + i * 3}rem` },
          { y: `-${11 + i * 6}rem`, ease: "none", duration: px(total) },
          0,
        );
      });

      // E o numeral de fundo dos outros capítulos deriva devagar — camada
      // lenta atrás, título parado no meio, poeira na frente.
      if (q(".ch-num-layer").length) {
        tl.fromTo(
          q(".ch-num-layer"),
          { y: 0 },
          { y: "-6rem", ease: "none", duration: px(total) },
          0,
        );
      }

      // O navio do MapPanel NAVEGA a rota inteira ao longo do capítulo:
      // zarpa de Vila Foosha quando o pin começa e atraca em Laugh Tale
      // quando ele solta. Dirigido por ESTA timeline (regra da casa: nada
      // dentro da faixa tem trigger próprio) — quem rola devagar vê o
      // mergulho na Ilha dos Homens-Peixe acontecer no meio do caminho.
      // `align` recoloca o navio no início do path, então o transform
      // inicial (atracado, para mobile/reduced) não interfere.
      const mapShip = q(".map-ship")[0];
      if (mapShip) {
        tl.to(
          mapShip,
          {
            motionPath: {
              path: "#rota-path",
              align: "#rota-path",
              alignOrigin: [0.5, 0.5],
            },
            ease: "none",
            duration: px(total),
          },
          0,
        );
      }

      /* ---- 2. horizontal, primeira metade ------------------------------ */
      tl.to(track, { x: -A, ease: "none", duration: px(A) }, px(PRE));

      // Parallax: contêiner e quadros percorrem distâncias diferentes em
      // tempos diferentes. Essa defasagem de ritmo é o que vira profundidade
      // — custa três linhas e lê como camada.
      //
      // Em rem (que acima de 992px é vw) e não em %: porcentagem aqui é
      // relativa à largura do próprio elemento, e como a faixa é larguíssima
      // isso viraria deslocamento de dezenas de vw e jogaria tudo pra fora.
      tl.fromTo(
        q(".ch-cluster"),
        { x: "4rem" },
        { x: "-6rem", ease: "none", duration: px(A) },
        px(PRE),
      ).fromTo(
        q(".ch-tile"),
        { x: "7rem" },
        {
          x: "-10rem",
          ease: "none",
          // 1,4× o contêiner é o que produz a defasagem — mas limitado ao que
          // ainda cabe na timeline. Em telas muito largas o curso horizontal
          // cresce e 1,4× passaria do fim, esticando a duração total e
          // desalinhando tudo o que vem depois.
          duration: Math.min(px(A) * 1.4, px(total - PRE)),
          stagger: px(70),
        },
        px(PRE),
      );

      // Zoom lento DENTRO de cada recorte, na direção oposta ao parallax.
      // A moldura anda pra um lado, a foto respira pro outro — é a segunda
      // camada de profundidade, e é o que faz o recorte parecer uma janela
      // e não um adesivo.
      tl.fromTo(
        q(".ch-tile img"),
        { scale: 1.18 },
        { scale: 1, ease: "none", duration: px(A), stagger: px(60) },
        px(PRE),
      );

      // Manchete e corpo do corredor. Nada aqui pode usar `data-reveal`:
      // dentro de uma seção fixada o elemento não anda na vertical, então um
      // ScrollTrigger comum dispararia na hora e o scrub ficaria sem curso.
      // Tudo o que vive na faixa é dirigido pela timeline.
      //
      // A manchete são TRÊS elementos .ch-head (as três linhas de cinema) —
      // cada linha sobe por conta própria, em cascata, e a linha "quente"
      // carrega a cor no elemento (o splitter achataria um <span> interno).
      // A manchete ENTRA quando a primeira parede domina a tela e SAI quando
      // ela cede lugar à segunda — janela generosa, sempre inteira.
      // Janelas da manchete/lead como fração de A.
      //
      // Nos capítulos SEM painel extra os números abaixo são os originais,
      // calibrados por captura real (comentários históricos logo adiante):
      // manchete entra em 0,375·A e sai em 0,70·A; lead entra em 0,755·A e
      // sai em 0,9·A.
      //
      // Nos capítulos COM painel extra (tripulacao, rota, guerras) o extra
      // ocupa ~0,667→0,923 do curso total — e como agora A === o offsetLeft
      // do painel de mídia (ver split acima), isso equivale a cerca de
      // 0,70→1,0 de A. As janelas antigas (que iam até ~0,73·A e ~0,935·A)
      // invadiam esse intervalo: a manchete/lead — fixas na tela, por cima de
      // QUALQUER conteúdo que o horizontal esteja mostrando atrás — ainda
      // estavam em cena quando o painel extra (CrewPanel/MapPanel/
      // MomentsPanel) começava a entrar, e o texto colidia visualmente com a
      // grade. A mesma coreografia interna (fade-in, stagger de letras,
      // fade-out) só é deslocada mais cedo, terminando bem antes do extra.
      const hasExtra = Boolean(extra);
      const HL_IN = hasExtra ? 0.3 : 0.375;
      const HL_CHARS_IN = hasExtra ? 0.305 : 0.38;
      const HL_LINE_OFFSET = hasExtra ? 0.003 : 0.004;
      const HL_CHARS_DUR = hasExtra ? 0.01 : 0.012;
      const HL_FADE_OUT = hasExtra ? 0.52 : 0.7;
      const HL_FADE_DUR = hasExtra ? 0.025 : 0.03;
      const LEAD_IN = hasExtra ? 0.56 : 0.755;
      const LEAD_WORDS_IN = hasExtra ? 0.565 : 0.76;
      const LEAD_WORDS_DUR = hasExtra ? 0.05 : 0.07;
      const LEAD_FADE_OUT = hasExtra ? 0.64 : 0.9;
      const LEAD_FADE_DUR = hasExtra ? 0.018 : 0.035;

      const heads = q(".ch-head") as HTMLElement[];
      const headSplits = heads.map((h) => splitText(h, "chars"));
      // 0,36 e não 0,16: a faixa tem ~390vw e o painel 1 ocupa os primeiros
      // 100vw, então em 16% do curso mais de meia tela ainda é o painel de
      // abertura — a manchete caía por cima do índice dele.
      // TODAS as durações da legenda em FRAÇÃO DE A, nunca em px fixo.
      // A janela de leitura é 0,38→0,66 de A; a entrada precisa caber no
      // primeiro quinto dela. Com passo fixo em px, num curso horizontal
      // maior a 3ª linha ainda subia atrás da máscara quando o fade-out já
      // tinha começado — e se lia "ol… metade… rabalho" o percurso inteiro.
      // A caixa acende no MESMO ponto em que as letras começam a subir. Havia
      // uma fresta de A*0,02 em que o bloco já estava visível e as letras
      // ainda deitadas atrás da máscara — 99px de scroll de texto invisível.
      tl.to(q(".ch-headline"), { opacity: 1, duration: px(A * 0.008) }, px(PRE + A * HL_IN));
      for (const [i, h] of heads.entries()) {
        h.classList.add("is-ready");
        const chars = headSplits[i].chars;
        if (chars.length) {
          tl.fromTo(
            chars,
            { yPercent: 150 },
            {
              yPercent: 0,
              // A entrada inteira (3 linhas + stagger de letras) tem que
              // caber em ~10% da janela de leitura. Medido: com o dobro
              // disso, 23% do percurso amostrado pegava a manchete no meio
              // da subida — letra cortada pela máscara, que é exatamente a
              // meia-palavra reclamada.
              duration: px(A * HL_CHARS_DUR),
              stagger: px(A * 0.0005),
              ease: "expo.out",
            },
            px(PRE + A * HL_CHARS_IN) + i * px(A * HL_LINE_OFFSET),
          );
        }
      }
      tl.to(
        q(".ch-headline"),
        { opacity: 0, y: "-3svh", duration: px(A * HL_FADE_DUR), ease: "power2.in" },
        px(PRE + A * HL_FADE_OUT),
      );
      // SEM blur aqui, de propósito. Blur amarrado a scrub fica parado no
      // meio quando o usuário rola devagar — e texto borrado estático lê
      // como defeito, não como reveal (visto em captura real). O blur vive
      // só nos reveals verticais de tempo (revealFadeUp).

      // O corpo "escreve" palavra a palavra amarrado ao mesmo scroll — agora
      // sobre a parede do segundo ato, mais adiante no corredor.
      // O corpo entra depois, sobre a segunda parede, e sai antes da pausa.
      const lead = q(".ch-lead")[0] as HTMLElement;
      const leadSplit = splitText(lead, "words");
      lead.classList.add("is-ready");
      tl.to(q(".ch-leadbox"), { opacity: 1, duration: px(A * 0.008) }, px(PRE + A * LEAD_IN));
      if (leadSplit.words.length) {
        tl.fromTo(
          leadSplit.words,
          { opacity: 0.14 },
          { opacity: 1, ease: "none", duration: px(A * LEAD_WORDS_DUR), stagger: px(A * 0.002) },
          px(PRE + A * LEAD_WORDS_IN),
        );
      }
      tl.to(
        q(".ch-leadbox"),
        { opacity: 0, y: "-2svh", duration: px(A * LEAD_FADE_DUR), ease: "power2.in" },
        px(PRE + A * LEAD_FADE_OUT),
      );

      /* ---- 3. A PAUSA: o horizontal congela e a foto abre -------------- */
      tl.to(
        media,
        { clipPath: OPEN, duration: px(PAUSE * 0.88), ease: "power2.inOut" },
        px(PRE + A),
      )
        .fromTo(
          q(".ch-media-img"),
          { scale: 1.22 },
          { scale: 1, duration: px(PAUSE), ease: "power2.out" },
          px(PRE + A),
        )
        .fromTo(
          q(".ch-caption"),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: px(PAUSE * 0.3), ease: "power2.out" },
          px(PRE + A + PAUSE * 0.45),
        );

      /* ---- 4. horizontal, resto: a foto desliza e os dados sobem ------- */
      tl.to(track, { x: -(A + B), ease: "none", duration: px(B) }, px(PRE + A + PAUSE)).fromTo(
        q(".ch-stats"),
        { yPercent: 120 },
        // Duração amarrada a PAUSE e B, nunca fixa: um valor cravado (1500px)
        // estoura o fim da timeline em telas largas, e como o ScrollTrigger
        // mapeia o scroll pela duração TOTAL, tudo encolhe junto — o
        // horizontal deixa de chegar ao fim dentro do pin. Terminar
        // exatamente em `total` é o que mantém o mapeamento honesto.
        { yPercent: 0, duration: px(PAUSE * 0.35), ease: "power2.out" },
        px(PRE + A + PAUSE * 0.3),
      );

      // Os numerais CONTAM enquanto sobem — só os que são número puro
      // (1400, 232…); os compostos (11'40, 1:16, 4×) ficam como estão.
      // Com scrub, o onUpdate roda nos dois sentidos e o número acompanha
      // o dedo. Tabular nums garantem que nada dança na largura.
      for (const el of q(".ch-stats [data-count]") as HTMLElement[]) {
        const end = parseInt(el.dataset.count!, 10);
        const counter = { v: 0 };
        tl.fromTo(
          counter,
          { v: 0 },
          {
            v: end,
            // A contagem POUSA com folga antes do fim do pin. Medido: com
            // ela terminando junto com o pin, os pontos amostrados pegavam
            // numero no meio do caminho ("528" no lugar de 600) e so o
            // ultimo quadro mostrava o valor certo.
            duration: px(PAUSE * 0.4),
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = String(Math.round(counter.v));
            },
          },
          px(PRE + A + PAUSE * 0.35),
        );
      }

      // O véu de virada acende no último trecho: a página inteira começa a
      // ser tingida pela cor do capítulo seguinte antes do pin soltar.
      tl.fromTo(
        q(".chapter-veil"),
        { opacity: 0 },
        { opacity: 1, ease: "none", duration: px(B + PAUSE * 0.2) },
        px(PRE + A + PAUSE * 0.8),
      );

      return () => {
        for (const split of headSplits) split.revert();
        leadSplit.revert();
      };
    },
    { scope: root, dependencies: [titleReady] },
  );

  const { color, images, hero, stats } = chapter;
  const digits = Array.from(hero.value);

  return (
    <section
      ref={root}
      id={chapter.key}
      className="chapter"
      data-chapter={chapter.key}
      aria-labelledby={`${chapter.key}-title`}
      style={
        {
          "--chapter-bg": color.bg,
          "--chapter-ink": color.ink,
          "--chapter-accent": color.accent,
        } as React.CSSProperties
      }
    >
      {/* O conteúdo acessível vive aqui, em prosa contínua e na ordem certa.
          O que está na faixa é a MESMA informação partida em letras, em SVG e
          embaralhada pela composição — bom pro olho, péssimo pra quem lê por
          áudio. Por isso a versão de leitura existe inteira, e não só o
          título. É o ponto onde a referência perde nota e não precisa. */}
      <div className="sr-only">
        <h2 id={`${chapter.key}-title`}>
          {chapter.index} — {chapter.title}: {chapter.heading}
        </h2>
        <p>{chapter.lead}</p>
        <p>{chapter.caption}</p>
        <ul>
          {stats.map((stat) => (
            <li key={stat.label}>
              {stat.label}: {stat.value}
              {stat.unit ?? ""}
            </li>
          ))}
        </ul>
      </div>

      <div className="chapter-track">
        {/* ============ PAINEL 1 — abertura ============ */}
        <div className="panel flex flex-col justify-between p-[6vw] lg:p-[3.4rem]">
          {/* A poeira do capítulo — seis motes na cor do acento, subindo.
              CSS puro; morre sozinha em prefers-reduced-motion. */}
          {[
            { left: "16%", top: "26%", size: "0.22rem", dur: "10s", delay: "0s", drift: "1.2rem", peak: 0.4 },
            { left: "72%", top: "20%", size: "0.16rem", dur: "13s", delay: "2.2s", drift: "-0.9rem", peak: 0.32 },
            { left: "62%", top: "66%", size: "0.18rem", dur: "11s", delay: "4.5s", drift: "0.8rem", peak: 0.36 },
            { left: "28%", top: "72%", size: "0.15rem", dur: "14s", delay: "1.2s", drift: "-1.1rem", peak: 0.3 },
            { left: "84%", top: "48%", size: "0.2rem", dur: "12s", delay: "6s", drift: "1rem", peak: 0.34 },
            { left: "42%", top: "38%", size: "0.14rem", dur: "15s", delay: "3.4s", drift: "0.6rem", peak: 0.26 },
          ].map((mote, i) => (
            <span
              key={i}
              aria-hidden
              className="mote"
              style={
                {
                  left: mote.left,
                  top: mote.top,
                  width: mote.size,
                  height: mote.size,
                  "--mote-dur": mote.dur,
                  "--mote-delay": mote.delay,
                  "--mote-drift": mote.drift,
                  "--mote-peak": mote.peak,
                } as React.CSSProperties
              }
            />
          ))}
          <div className="flex items-baseline justify-between">
            <p className="t-micro" style={{ color: color.accent }}>
              {chapter.index} — {chapter.kicker}
            </p>
            <p className="t-micro ink-faint">One Piece · A jornada</p>
          </div>

          {/* Numeral e nome dividem o mesmo centro óptico, separados só por
              profundidade: o numeral vazado atrás, o nome cheio na frente.
              No AMANHECER o numeral sai de cena — os arabescos assumem o
              papel de camada de fundo, como no layout aprovado. */}
          {chapter.key !== "amanhecer" && (
            <div className="ch-num-layer pointer-events-none absolute inset-0 flex items-center justify-center">
              <p
                aria-hidden
                className="t-mega t-outline t-nums flex overflow-hidden leading-none"
                style={{ "--outline": color.accent, opacity: 0.55 } as React.CSSProperties}
              >
                {digits.map((digit, i) => (
                  <span key={i} className="ch-digit inline-block">
                    {digit}
                  </span>
                ))}
              </p>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-[7vw]">
            <div
              className={`ch-title w-full ${chapter.key === "amanhecer" ? "max-w-[86vw]" : "max-w-[74vw]"}`}
            >
              <SvgWord
                text={chapter.title}
                tracking={0.055}
                strokeWidth={1.4}
                letterClassName="ch-letter"
                onLayout={(l) => {
                  letters.current = l;
                  setTitleReady(true);
                }}
              />
            </div>
          </div>

          <ChapterScene chapter={chapter} />

          <div className="flex items-end justify-between gap-8">
            <p className="ch-hero-label t-micro ink-soft max-w-[16rem]">
              {/* o VALOR faz parte do rótulo — "Água na extração · 92 °C".
                  Sem ele, o capítulo que esconde o numeral gigante (AMANHECER)
                  ficava com um rótulo órfão: "· °C" de coisa nenhuma. */}
              {hero.label} · {hero.value}
              {/* normal-case no filho vence o uppercase do pai — sem isso o
                  µ de "µm" vira Μ grego maiúsculo e o rótulo lê "600 MM" */}
              {hero.unit ? <span className="normal-case"> {hero.unit}</span> : null}
            </p>
            <p className="t-micro ink-faint hidden lg:block">Role →</p>
          </div>
        </div>

        {/* ============ PAINEL 2 — o corredor de cinema ============
            Nada de recortes flutuando num campo vazio: duas PAREDES de mídia
            de altura inteira, com a tipografia EM CIMA da foto. Junto com o
            vídeo do painel 3, formam os três atos do capítulo: plano aberto
            (contexto) → plano do processo (gente) → sangria em movimento.
            O trilho horizontal é o travelling entre eles. */}
        <div className="panel panel-wide flex items-stretch gap-[6vw] px-[6vw]">
          <div className="ch-cluster flex h-full items-stretch gap-[6vw]">
            {/* ATO 1 — plano aberto, com a manchete de três linhas */}
            <figure className="ch-tile ch-wall w-[80vw]">
              <Image
                src={images.cluster[chapter.wall.wide]}
                alt={images.alt.cluster[chapter.wall.wide]}
                fill
                sizes="(max-width: 991px) 100vw, 80vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgb(0 0 0 / 0.66) 0%, rgb(0 0 0 / 0.14) 42%, transparent 68%)",
                }}
              />
            </figure>

            {/* ATO 2 — o processo, com o corpo escrevendo por cima */}
            <figure className="ch-tile ch-wall w-[62vw]">
              <Image
                src={images.cluster[chapter.wall.mid]}
                alt={images.alt.cluster[chapter.wall.mid]}
                fill
                sizes="(max-width: 991px) 100vw, 62vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgb(0 0 0 / 0.72) 0%, rgb(0 0 0 / 0.2) 40%, transparent 65%)",
                }}
              />
            </figure>
          </div>
        </div>

        {/* ============ PAINEL EXTRA (opcional) ============
            Entra só quando o capítulo recebe `extra` — é um painel estático
            a mais na faixa, sem ScrollTrigger próprio (nada dentro de uma
            seção fixada pode animar por conta própria). O cálculo de
            `overflow` já mede `track.scrollWidth`, então a largura extra
            entra na timeline sem precisar mexer em nenhum número aqui. */}
        {extra && (
          <div className="panel flex items-center px-[6vw]">{extra}</div>
        )}

        {/* ============ PAINEL 3 — mídia em sangria ============ */}
        <div className="panel panel-media relative">
          <div className="ch-media absolute inset-0 overflow-hidden">
            {/*
              Vídeo com `data-src` em vez de `src`, e `preload="none"`:
              cinco vídeos em sangria carregando de uma vez no load seriam
              dezenas de MB antes do primeiro scroll. O src só é colado
              quando a seção se aproxima (ver o ScrollTrigger de pré-carga).

              O `poster` é a foto do capítulo — então o painel já está certo
              no primeiro quadro, e continua certo se o vídeo falhar, se o
              usuário economizar dados ou se o navegador recusar autoplay.
            */}
            <video
              className="ch-media-img h-full w-full object-cover"
              data-src={images.video}
              poster={images.full}
              aria-label={images.alt.full}
              muted
              loop
              playsInline
              // Só o primeiro capítulo busca os metadados de saída: é o
              // único que o usuário alcança em segundos. Os outros quatro
              // ficam em "none" até a pré-carga do ScrollTrigger.
              preload={first ? "metadata" : "none"}
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgb(0 0 0 / 0.72) 0%, rgb(0 0 0 / 0.12) 45%, transparent 70%)",
              }}
            />
          </div>

        </div>
      </div>

      {/* ============ LEGENDA E DADOS DA MÍDIA ============
          Também FORA da faixa. Estavam dentro do painel de mídia, que tem
          130vw — mais largo que a tela de propósito, pra sobrar deslocamento.
          Resultado: os numerais deslizavam junto com o painel e saíam cortados
          pela esquerda ("528" em vez de 600, o P de "PONTO PADRÃO" comido).
          Aqui eles ficam presos à tela e a foto desliza por baixo. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[4] hidden lg:block">
        <figcaption className="ch-caption absolute top-[3.4rem] left-[3.4rem] max-w-[22rem] opacity-0">
          <p className="t-cap text-cream/85">{chapter.caption}</p>
        </figcaption>

        {/* Os dados sobem por cima da foto já aberta. Numerais vazados,
            rótulos minúsculos — o contraste de escala é o recurso. */}
        <div
          className={`ch-stats absolute right-[3.4rem] bottom-[3rem] left-[3.4rem] flex items-end justify-between gap-[3rem] ${
            color.blend ? "blend-diff" : ""
          }`}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-[0.6rem]">
              <p
                className="t-giant t-outline t-nums"
                style={{ "--outline": color.accent } as React.CSSProperties}
                data-count={/^\d+$/.test(stat.value) ? stat.value : undefined}
              >
                {stat.value}
              </p>
              <div className="pb-[1.2rem]">
                {stat.unit && (
                  // mb: a unidade tem line-height 0,86 e glifos com
                  // descendente (o µ de µm), que passavam por baixo da caixa
                  // e comiam a primeira letra do rótulo ("ONTO PADRÃO")
                  <p className="t-big normal-case mb-[0.55rem]" style={{ color: color.accent }}>
                    {stat.unit}
                  </p>
                )}
                <p className="t-micro whitespace-nowrap text-cream/70">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============ A LEGENDA DO TRAVELLING ============
          Manchete e corpo vivem AQUI, fora da faixa — a seção está fixada,
          então este bloco é fixo na tela enquanto as paredes de foto passam
          por trás. Coladas na parede, as palavras saíam de cena junto com
          ela e o usuário pegava meia-palavra em quase todo o percurso
          ("ol… metade… rabalho", visto em captura real).
          Câmera anda, letreiro segura: é assim no cinema. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[3] hidden lg:block">
        <div className="ch-headline absolute bottom-[9svh] left-[6vw] opacity-0 lg:left-[3.4rem]">
          <p className="t-micro mb-[1.6rem] text-cream/70">
            {chapter.index} / 05 — {chapter.kicker}
          </p>
          {chapter.headline.lines.map((line, i) => (
            <p
              key={line}
              className="ch-head"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "7.2rem",
                lineHeight: 0.82,
                letterSpacing: "-0.035em",
                // SEMPRE claro, com scrim escuro atrás (ver .ch-headline::before).
                // A tinta do capítulo é a régua errada aqui: a legenda vive
                // sobre FOTO, e as fotos do Amanhecer são escuras mesmo com o
                // campo de cor claro — tinta escura sumia nelas.
                color: i === chapter.headline.hot ? color.accent : "#f7f2e8",
              }}
            >
              {line}
            </p>
          ))}
        </div>

        <div className="ch-leadbox absolute right-[6vw] bottom-[11svh] max-w-[30rem] opacity-0 lg:right-[3.4rem]">
          <p className="ch-lead t-body text-cream/95">
            {chapter.lead}
          </p>
        </div>
      </div>

      {/* o véu que tinge o fim do capítulo com a cor do próximo */}
      <div
        aria-hidden
        className="chapter-veil"
        style={{ "--veil": nextBg } as React.CSSProperties}
      />
    </section>
  );
}
