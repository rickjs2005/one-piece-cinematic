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
 *
 * A cena tem dois planos, e os dois se sobrepõem por um trecho longo (0.34 a
 * 0.52). Essa sobreposição é o ponto: enquanto os olhos ainda recuam, a sala do
 * trono já está entrando por baixo. A versão anterior trocava os planos numa
 * janela curta e o intervalo entre eles ficava vazio.
 */

export type HeroTimelineOptions = {
  /** Mobile desliga blur — é o filtro mais caro da cena em GPU integrada. */
  allowBlur: boolean;
  /** Mobile recua menos: escala inicial alta em tela pequena vira mancha. */
  dollyDepth: number;
};

type LayerQuery = (selector: string) => HTMLElement | null;

export function buildHeroTimeline(
  q: LayerQuery,
  { allowBlur, dollyDepth }: HeroTimelineOptions,
): gsap.core.Timeline {
  const tl = gsap.timeline({ defaults: { ease: "none" } });

  const eyes = q('[data-layer="eyes"]');
  const throne = q('[data-layer="throne"]');
  const vignette = q("[data-vignette]");
  const title = q("[data-hero-title]");
  const sub = q("[data-hero-sub]");
  const hint = q("[data-scroll-hint]");

  // Reserva a duração total mesmo que alguma camada falte (arte que não
  // carregou): sem isso a timeline encolheria e o scrub sairia do lugar.
  tl.to({}, { duration: 1 }, 0);

  // ── Cena 1 → 2: a câmera recua dos olhos ─────────────────────────────────
  if (eyes) {
    tl.fromTo(
      eyes,
      { scale: dollyDepth, opacity: 1 },
      { scale: 1, duration: 0.55 },
      0,
    ).to(eyes, { opacity: 0, duration: 0.18 }, 0.34);
  }

  // ── Cena 3 → 5: a sala do trono assume e continua recuando ───────────────
  if (throne) {
    tl.fromTo(
      throne,
      { scale: dollyDepth * 0.72, opacity: 0 },
      { scale: 1, duration: 0.78 },
      0.22,
    ).to(throne, { opacity: 1, duration: 0.2 }, 0.32);

    if (allowBlur) {
      tl.fromTo(
        throne,
        { filter: "blur(14px)" },
        { filter: "blur(0px)", duration: 0.3 },
        0.32,
      );
    }
  }

  // ── A escuridão em volta se abre ─────────────────────────────────────────
  if (vignette) {
    tl.fromTo(
      vignette,
      { opacity: 1 },
      { opacity: 0.35, duration: 0.5 },
      0.15,
    );
  }

  // ── O título fecha a cena ────────────────────────────────────────────────
  if (hint) {
    tl.to(hint, { opacity: 0, duration: 0.06 }, 0.03);
  }

  if (title) {
    tl.fromTo(
      title,
      { opacity: 0, yPercent: 40, filter: "blur(12px)" },
      {
        opacity: 1,
        yPercent: 0,
        filter: "blur(0px)",
        duration: 0.16,
        ease: "power3.out",
      },
      0.74,
    );
  }

  if (sub) {
    tl.fromTo(
      sub,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" },
      0.84,
    );
  }

  return tl;
}

/**
 * Estado final da cena, aplicado sem animação.
 *
 * Usado quando `prefers-reduced-motion` está ativo: a página mostra o plano
 * final (sala do trono revelada) e o scroll é comum.
 */
export function applyHeroFinalState(q: LayerQuery) {
  const set = (selector: string, vars: gsap.TweenVars) => {
    const el = q(selector);
    if (el) gsap.set(el, vars);
  };

  set('[data-layer="eyes"]', { opacity: 0 });
  set('[data-layer="throne"]', { opacity: 1, scale: 1 });
  set("[data-vignette]", { opacity: 0.35 });
  set("[data-hero-title]", { opacity: 1, yPercent: 0, filter: "blur(0px)" });
  set("[data-hero-sub]", { opacity: 1, y: 0 });
  set("[data-scroll-hint]", { opacity: 0 });
}
