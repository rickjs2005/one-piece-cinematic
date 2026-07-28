import gsap from "gsap";

/**
 * Constrói a timeline do hero.
 *
 * Isolado das camadas de propósito: as camadas não sabem que existe uma
 * timeline, e este arquivo não sabe como as camadas são desenhadas. Mudar o
 * ritmo da cena é mexer só aqui.
 *
 * A timeline tem duração 1 e cada tween é posicionada pela fração do scroll em
 * que deve acontecer, então os números abaixo leem como o storyboard:
 * 0.18 é "18% do scroll".
 */

export type HeroTimelineOptions = {
  /** Mobile desliga blur — é o filtro mais caro da cena em GPU integrada. */
  allowBlur: boolean;
  /** Mobile recua menos: escala inicial 3 em tela pequena vira mancha. */
  dollyDepth: number;
};

type LayerQuery = (selector: string) => HTMLElement | null;

export function buildHeroTimeline(
  q: LayerQuery,
  { allowBlur, dollyDepth }: HeroTimelineOptions,
): gsap.core.Timeline {
  const tl = gsap.timeline({ defaults: { ease: "none", duration: 0.001 } });

  const eyes = q('[data-layer="eyes"]');
  const artClose = q('[data-layer="art-close"]');
  const artThrone = q('[data-layer="art-throne"]');
  const rays = q('[data-layer="rays"]');
  const swords = q('[data-layer="swords"]');
  const darkness = q('[data-layer="darkness"]');
  const title = q("[data-hero-title]");
  const scrollHint = q("[data-scroll-hint]");

  // Reserva a duração total mesmo que alguma camada falte (arte que não
  // carregou): sem isso a timeline encolheria e o scrub sairia do lugar.
  tl.to({}, { duration: 1 }, 0);

  // ── Cena 1 → 2: os olhos recuam e se apagam ──────────────────────────────
  if (eyes) {
    tl.fromTo(
      eyes,
      { scale: 1, opacity: 1 },
      { scale: 0.42, opacity: 1, duration: 0.34 },
      0,
    ).to(eyes, { opacity: 0, duration: 0.12 }, 0.22);
  }

  // ── A escuridão se abre ──────────────────────────────────────────────────
  if (darkness) {
    tl.fromTo(
      darkness,
      { scale: 1, opacity: 1 },
      { scale: 1.45, opacity: 0.5, duration: 0.8 },
      0.05,
    );
  }

  // ── Cena 2: a arte em close assume ───────────────────────────────────────
  if (artClose) {
    tl.fromTo(
      artClose,
      { scale: dollyDepth * 0.93, opacity: 0 },
      { opacity: 1, duration: 0.12 },
      0.18,
    )
      .to(artClose, { scale: 1, duration: 0.37 }, 0.18)
      .to(artClose, { opacity: 0, duration: 0.12 }, 0.5);
  }

  // ── Cena 3: o trono surge ────────────────────────────────────────────────
  if (artThrone) {
    // O dolly do trono cobre a timeline inteira, inclusive o trecho em que ele
    // ainda está invisível. É isso que faz o recuo parecer um movimento só,
    // mesmo trocando de camada no meio do caminho.
    tl.fromTo(
      artThrone,
      { scale: dollyDepth, opacity: 0 },
      { scale: 1, duration: 0.85 },
      0,
    ).to(artThrone, { opacity: 1, duration: 0.14 }, 0.46);

    if (allowBlur) {
      tl.fromTo(
        artThrone,
        { filter: "blur(10px)" },
        { filter: "blur(0px)", duration: 0.34 },
        0.46,
      );
    }
  }

  // ── Os feixes de luz descem ──────────────────────────────────────────────
  if (rays) {
    tl.fromTo(
      rays,
      { opacity: 0, scaleY: 0.65, transformOrigin: "50% 0%" },
      { opacity: 0.7, scaleY: 1, duration: 0.25 },
      0.45,
    );
  }

  // ── Cena 5: as espadas entram em primeiro plano ──────────────────────────
  if (swords) {
    tl.fromTo(
      swords,
      { yPercent: 100 },
      { yPercent: 0, duration: 0.2, ease: "power2.out" },
      0.72,
    );

    if (allowBlur) {
      tl.fromTo(
        swords,
        { filter: "blur(0px)" },
        { filter: "blur(7px)", duration: 0.16 },
        0.78,
      );
    }
  }

  // ── O título fecha a cena ────────────────────────────────────────────────
  if (scrollHint) {
    tl.to(scrollHint, { opacity: 0, duration: 0.08 }, 0.04);
  }

  if (title) {
    tl.fromTo(
      title,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" },
      0.86,
    );
  }

  return tl;
}

/**
 * Estado final da cena, aplicado sem animação.
 *
 * Usado quando `prefers-reduced-motion` está ativo: a página mostra o plano
 * final (trono revelado, espadas em primeiro plano) e o scroll é comum.
 */
export function applyHeroFinalState(q: LayerQuery) {
  const set = (selector: string, vars: gsap.TweenVars) => {
    const el = q(selector);
    if (el) gsap.set(el, vars);
  };

  set('[data-layer="eyes"]', { opacity: 0 });
  set('[data-layer="art-close"]', { opacity: 0 });
  set('[data-layer="art-throne"]', { opacity: 1, scale: 1 });
  set('[data-layer="rays"]', { opacity: 0.7 });
  set('[data-layer="swords"]', { yPercent: 0 });
  set('[data-layer="darkness"]', { opacity: 0.5, scale: 1.45 });
  set("[data-hero-title]", { opacity: 1, y: 0 });
  set("[data-scroll-hint]", { opacity: 0 });
}
