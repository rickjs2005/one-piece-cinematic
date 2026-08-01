"use client";

import Image from "next/image";
import { CHAPTERS } from "@/content/chapters";
import { scrollToId } from "@/lib/scroll";

/**
 * O manifesto — agora um espelho editorial da referência aprovada:
 *
 *   ┌ manchete com sublinhado a pincel ┐  ┌ parágrafo com palavras acesas ┐
 *   │ 01 EXECUÇÃO   ⚔ a espada         │  │ parágrafo de apoio            │
 *   │ 02 TRIPULAÇÃO ☀ o chapéu         │  │ [selo][selo][selo]            │
 *   │ ...                             │  │ foto + carimbo giratório      │
 *   └─────────────────────────────────┘  └───────────────────────────────┘
 *
 * A lista é um índice de verdade: cada linha rola até o capítulo. E cada
 * linha carrega a COR do capítulo — é a primeira vez que a paleta inteira
 * da jornada aparece junta, funcionando como legenda do que vem.
 */

/**
 * Cor de exibição das linhas sobre o fundo carvão. Quase sempre o accent do
 * capítulo serve, mas o do Amanhecer (#b0451f) foi calibrado pro fundo CLARO
 * daquele capítulo — aqui no escuro ele afunda. Vira um cobre mais aceso.
 */
const ROW_COLOR: Record<string, string> = { amanhecer: "#c95f33" };

/** Ícones da casa: traço 1.5, sem preenchimento, herdam a cor da linha. */
function ChapterIcon({ id }: { id: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (id) {
    case "execucao": // a espada
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" {...common}>
          <path d="M4 20 L15 9" />
          <path d="M13 7 L18 2 L22 6 L17 11" />
          <path d="M7 15 L11 19" />
        </svg>
      );
    case "tripulacao": // o chapéu
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" {...common}>
          <path d="M3 15h18" />
          <path d="M7 15a5 5 0 0 1 10 0" />
          <path d="M7 13h10" />
        </svg>
      );
    case "rota": // a bússola
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" {...common}>
          <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" />
          <path d="M15.5 8.5 13 13l-4.5 2.5L11 11Z" />
        </svg>
      );
    case "guerras": // a bandeira
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" {...common}>
          <path d="M6 3v18" />
          <path d="M6 4h11l-2.5 3 2.5 3H6" />
        </svg>
      );
    default: // o amanhecer — o horizonte e o sol nascendo
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" {...common}>
          <path d="M3 17h18" />
          <path d="M7 17a5 5 0 0 1 10 0" />
          <path d="M12 6v2.5M5.6 8.6l1.8 1.8M18.4 8.6l-1.8 1.8" />
        </svg>
      );
  }
}

const PROOFS = [
  {
    key: "cena",
    title: "Uma cena só",
    sub: "Do trono ao amanhecer",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
        <path d="M3 15h18" />
        <path d="M7 15a5 5 0 0 1 10 0" />
        <path d="M7 13h10" />
      </svg>
    ),
  },
  {
    key: "ilustracoes",
    title: "33 ilustrações",
    sub: "Geradas por IA, inspiradas na obra",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
        <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" />
        <path d="M15.5 8.5 13 13l-4.5 2.5L11 11Z" />
      </svg>
    ),
  },
  {
    key: "vinculo",
    title: "Sem vínculo",
    sub: "Projeto de demonstração",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
        <path d="M6 3v18" />
        <path d="M6 4h11l-2.5 3 2.5 3H6" />
      </svg>
    ),
  },
];

export function Intro() {
  return (
    <section
      id="manifesto"
      className="relative bg-coal px-[6vw] py-[13rem] lg:px-[3.4rem]"
      aria-labelledby="manifesto-title"
    >
      <div className="flex items-baseline justify-between">
        <p className="t-micro text-[var(--color-gold)]">Manifesto</p>
        <p className="t-micro text-cream/30">Desde 1997</p>
      </div>

      <div className="mt-[5rem] grid gap-[6rem] lg:grid-cols-[minmax(0,1fr)_minmax(0,42rem)] lg:gap-[5rem]">
        {/* ============ coluna esquerda: manchete + índice ============ */}
        <div>
          {/* t-huge, não t-giant: em 11rem a manchete quebrava em três
              linhas e engolia a coluna inteira — a referência a mantém em
              duas ou três, com o índice logo abaixo como protagonista. */}
          <h2 id="manifesto-title" className="t-huge max-w-[17ch]" data-reveal="fadeup">
            A história que o mundo tentou apagar.
          </h2>

          {/* O risco de pincel — a única linha "à mão" do site inteiro.
              Por isso ela funciona: tudo o mais é régua. */}
          <svg
            aria-hidden
            viewBox="0 0 320 14"
            fill="none"
            className="mt-[1.6rem] w-[19rem] text-[var(--color-gold)]"
          >
            <path
              d="M4 9 C 60 4, 150 11, 210 7 S 300 5, 316 8"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M40 11.5 C 110 8.5, 200 12.5, 270 10"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity="0.4"
            />
          </svg>

          {/* O índice da jornada. Cada linha é um atalho pro capítulo — e
              carrega a cor dele: a paleta inteira apresentada de uma vez. */}
          <ul className="mt-[4.5rem]">
            {CHAPTERS.map((chapter) => (
              <li key={chapter.key} className="border-t border-cream/12 last:border-b">
                <a
                  href={`#${chapter.key}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId(chapter.key);
                  }}
                  className="intro-row group grid grid-cols-[4.2rem_minmax(0,1fr)_auto] items-center gap-[1.6rem] py-[1.55rem]"
                  style={{ color: ROW_COLOR[chapter.key] ?? chapter.color.accent }}
                >
                  <span className="t-big t-nums text-cream/25 transition-colors duration-500 group-hover:text-cream/45">
                    {chapter.index}
                  </span>
                  <span className="t-big intro-row-name">{chapter.title}</span>
                  <span className="flex items-center gap-[0.9rem]">
                    <span aria-hidden className="h-[1.15rem] w-[1.15rem] opacity-80">
                      <ChapterIcon id={chapter.key} />
                    </span>
                    <span className="t-micro w-[7.5rem] text-cream/40 transition-colors duration-500 group-hover:text-cream/70">
                      {chapter.kicker}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ============ coluna direita: prosa + provas + foto ============ */}
        <div className="flex flex-col gap-[2.6rem] lg:pt-[0.8rem]">
          {/* Sem reveal por palavra AQUI de propósito: o splitter achata o
              conteúdo pra texto puro e apagaria os destaques coloridos —
              que são o ponto deste parágrafo. */}
          <p className="t-lead text-cream/85">
            Não é lenda passada adiante boca a boca. É a mesma obra, contada de
            novo: o grito de um homem no cadafalso, a{" "}
            <em className="voice text-[var(--color-gold)]">tripulação</em> que se
            formou por acaso e o{" "}
            <em className="voice text-[var(--color-ember)]">tesouro</em> que
            ainda não tem dono — só uma rota até ele.
          </p>

          <p className="t-body max-w-[44ch] text-cream/50" data-reveal="write">
            São cinco capítulos entre o cadafalso de Loguetown e o amanhecer
            prometido. Nenhum deles inventa nada — cada um recorta um momento
            real da mesma jornada, na ordem em que ela aconteceu.
          </p>

          {/* A régua de provas — três fatos, um contêiner. */}
          <ul className="grid grid-cols-1 overflow-hidden rounded-[0.8rem] border border-cream/12 bg-cream/[0.03] sm:grid-cols-3">
            {PROOFS.map((proof) => (
              <li
                key={proof.key}
                className="flex items-center gap-[1rem] border-b border-cream/12 px-[1.4rem] py-[1.2rem] last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0"
              >
                <span
                  aria-hidden
                  className="grid h-[2.6rem] w-[2.6rem] shrink-0 place-items-center rounded-full border border-[var(--color-gold)]/35 bg-[var(--color-gold)]/8 p-[0.6rem] text-[var(--color-gold)]"
                >
                  {proof.icon}
                </span>
                <span>
                  <span className="t-cap block font-semibold text-cream/90">{proof.title}</span>
                  {/* NÃO usa t-micro: ele impõe caixa alta e entreletra
                      larga depois do normal-case (cascata, mesma
                      especificidade) e a legenda gritava mais que o
                      título. Aqui ela sussurra, como na referência. */}
                  <span className="mt-[0.25rem] block text-[0.68rem] leading-[1.3] text-cream/40">
                    {proof.sub}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          {/* A foto, com o carimbo girando na quina — o único elemento
              "de selo" do site, e por isso ele mora aqui, no manifesto. */}
          <div className="relative mt-[0.6rem]">
            <div className="relative aspect-[3/2] overflow-hidden rounded-[0.8rem]">
              <Image
                src="/shot/tripulacao/b.webp"
                alt="Banquete barulhento no convés à noite, lanternas acesas."
                fill
                sizes="(max-width: 991px) 92vw, 42rem"
                className="object-cover"
              />
              {/* funde a foto no carvão da página — sem isso ela vira
                  "figura colada", com isso vira janela */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(120% 90% at 50% 40%, transparent 55%, rgb(11 9 8 / 0.55) 100%)",
                }}
              />
            </div>

            <div aria-hidden className="seal absolute -right-[1.2rem] -bottom-[1.6rem] h-[8.6rem] w-[8.6rem]">
              <svg viewBox="0 0 120 120" className="seal-spin h-full w-full text-[var(--color-gold)]">
                <defs>
                  <path
                    id="seal-arc"
                    d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0"
                  />
                </defs>
                <circle cx="60" cy="60" r="57" fill="rgb(11 9 8 / 0.72)" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1" />
                <circle cx="60" cy="60" r="33" fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" />
                <text
                  fill="currentColor"
                  fontSize="10.5"
                  fontWeight={800}
                  letterSpacing="2.6"
                  fontFamily="var(--font-sans), sans-serif"
                >
                  <textPath href="#seal-arc" startOffset="0%">
                    DE LOGUETOWN ✦ AO AMANHECER ✦
                  </textPath>
                </text>
              </svg>
              {/* o horizonte no miolo não gira junto — carimbo gira, brasão não */}
              <span className="absolute inset-0 grid place-items-center text-[var(--color-gold)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="h-[2.1rem] w-[2.1rem]">
                  <path d="M3 17h18" />
                  <path d="M7 17a5 5 0 0 1 10 0" />
                  <path d="M12 6v2.5M5.6 8.6l1.8 1.8M18.4 8.6l-1.8 1.8" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
