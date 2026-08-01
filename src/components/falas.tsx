import Image from "next/image";
import { VOICES } from "@/content/voices";

/**
 * As falas — vitrine editorial, no MESMO molde da vitrine dos cafés da
 * referência (TERRAL): numeral vazado ao fundo, retrato mascarado como
 * recorte com luz própria, clarão de acento que acende no hover.
 *
 * Mas a FORMA muda porque o conteúdo muda. Três cafés cabem em cinco planos
 * de tela cheia cada — dez falas nesse formato virariam 1500svh de rolagem
 * pra ler dez frases. Uma vitrine editorial pede LISTA: dez linhas curtas,
 * escaneáveis, uma atrás da outra. É por isso que este arquivo usa a família
 * `.coffee-row`/`.coffee-num`/`.coffee-pack`/`.pack-photo` do CSS da casa —
 * portada junto com o resto na Fundação, mas até aqui sem nenhum componente
 * que a consumisse. Esta é a primeira.
 *
 * Sem GSAP próprio: o hover é CSS puro (`.coffee-row:hover`) e a entrada em
 * cena usa o vocabulário sitewide de `lib/reveal.ts` — `data-reveal="write"`
 * na fala (ela "se escreve" enquanto rola, o mesmo gesto de um parágrafo
 * comum) e `data-mask` no retrato (a foto sobe de trás de uma máscara, o
 * mesmo tratamento genérico dado a qualquer imagem da casa). Nenhuma
 * coreografia bespoke — só o que a fundação já oferece.
 *
 * Ordem preservada do `VOICES`: é narrativa (começo → herança → morte →
 * sonho → cinismo → verdade → gratidão → continuidade → lealdade), não
 * cronológica, e o arquivo de conteúdo documenta isso — não é pra reordenar.
 */
export function Falas() {
  return (
    <section id="falas" className="relative bg-coal" aria-labelledby="falas-title">
      <div className="flex flex-col gap-[1rem] px-[6vw] pt-[10rem] pb-[4rem] lg:px-[3.4rem]">
        <p className="t-micro text-[var(--color-gold)]">O que se disse</p>
        <h2 id="falas-title" className="t-huge max-w-[20ch]" data-reveal="fadeup">
          As falas que ficaram
        </h2>
      </div>

      {VOICES.map((voice, index) => (
        <article
          key={voice.id}
          className="coffee-row group border-t border-cream/12 last:border-b"
          style={{ "--chapter-accent": `var(--color-${voice.accent})` } as React.CSSProperties}
        >
          {/* O visual quebra a fala em contexto / nome / lead / frase — pra
              quem lê por áudio ela volta a ser uma coisa só, na ordem certa,
              com o "porquê" (weight) incluso mesmo escondido no mobile. */}
          <h3 className="sr-only">
            {voice.speaker} — {voice.context}. {voice.lead ? `${voice.lead} ` : ""}
            {voice.quote} {voice.weight}
          </h3>

          <div className="relative grid gap-[2.4rem] px-[6vw] py-[4rem] lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:items-center lg:gap-[4rem] lg:px-[3.4rem] lg:py-[5.5rem]">
            {/* o numeral gigante de fundo: vazado em repouso, e no hover da
                LINHA INTEIRA ganha preenchimento translúcido na cor do
                acento (regra já pronta em `.coffee-row:hover .coffee-num`).
                `overflow: hidden` do `.coffee-row` corta o excesso — é assim
                que um numeral de 24rem cabe numa linha de lista. */}
            <p
              aria-hidden
              className="coffee-num t-mega t-outline t-nums"
              style={{ "--outline": `var(--color-${voice.accent})` } as React.CSSProperties}
            >
              {String(index + 1).padStart(2, "0")}
            </p>

            {/* o retrato — recorte com luz própria via máscara radial
                (`.pack-photo`), a MESMA linguagem da embalagem na vitrine
                original: a foto some nas bordas e sobra o rosto no
                spotlight. `.coffee-pack` inclina um fio no hover da linha; o
                zoom do miolo é o `group-hover` no próprio `<Image>`. */}
            <div
              data-mask
              className="coffee-pack pack-photo relative mx-auto aspect-[4/5] w-full max-w-[15rem] lg:mx-0"
            >
              <Image
                src={voice.portrait}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 991px) 60vw, 15rem"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* a coluna de leitura. Sem preço, sem CTA, sem WhatsApp — a
                linha não vende nada e não é clicável. */}
            <div className="relative flex flex-col gap-[1.1rem]">
              <p className="t-micro" style={{ color: `var(--color-${voice.accent})` }}>
                {voice.context}
              </p>

              <p className="t-big">{voice.speaker}</p>

              <blockquote>
                {voice.lead && <p className="t-cap text-cream/50">{voice.lead}</p>}
                <p className="voice t-lead mt-[0.3rem] text-cream/90" data-reveal="write">
                  “{voice.quote}”
                </p>
              </blockquote>

              {/* a linha de apoio — o "porquê" da fala pesar. Some no
                  mobile: é nota de rodapé, não parte do essencial. */}
              <p className="t-micro hidden max-w-[36ch] text-cream/35 lg:block">
                {voice.weight}
              </p>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
