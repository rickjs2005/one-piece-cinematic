import type { CrewMate } from "@/content/crew";

/**
 * Emblema de cada tripulante.
 *
 * Não há arte licenciada dos personagens no projeto. Em vez de um retrato falso
 * ou de um retângulo cinza, cada card recebe o símbolo do personagem em traço —
 * o chapéu de palha, as três espadas, a rosa dos ventos. Lê na hora e não finge
 * ser o que não é.
 *
 * Tudo é traço (`stroke`), sem preenchimento: mantém a página coerente com a
 * luz fria da cena do trono.
 */

function Hat() {
  return (
    <>
      <ellipse cx="50" cy="63" rx="38" ry="11" />
      <path d="M22 63 C24 33 76 33 78 63" />
      <path d="M24 57 C36 63 64 63 76 57" className="accent" />
    </>
  );
}

function Swords() {
  return (
    <>
      <path d="M16 84 L70 26" />
      <path d="M30 88 L84 30" />
      <path d="M50 90 L50 18" />
      <path d="M60 30 L74 44" className="accent" />
    </>
  );
}

function Compass() {
  return (
    <>
      <circle cx="50" cy="50" r="33" />
      <path d="M50 17 L57 43 L83 50 L57 57 L50 83 L43 57 L17 50 L43 43 Z" />
      <path d="M50 17 L57 43 L43 43 Z" className="accent" />
    </>
  );
}

function Slingshot() {
  return (
    <>
      <path d="M50 88 L50 54" />
      <path d="M50 54 L28 26" />
      <path d="M50 54 L72 26" />
      <path d="M28 26 Q50 46 72 26" className="accent" />
    </>
  );
}

function Flame() {
  return (
    <>
      <path d="M50 14 C64 34 76 44 76 60 C76 76 64 86 50 86 C36 86 24 76 24 60 C24 46 36 38 42 28" />
      <path d="M50 50 C56 58 58 64 55 72 C52 79 45 79 42 72 C39 65 44 58 50 50 Z" className="accent" />
    </>
  );
}

function Antlers() {
  return (
    <>
      <path d="M44 86 L40 56 L24 40 M40 56 L26 62 M40 50 L22 26" />
      <path d="M56 86 L60 56 L76 40 M60 56 L74 62 M60 50 L78 26" />
      <path d="M44 86 L56 86" className="accent" />
    </>
  );
}

function Flower() {
  return (
    <>
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <ellipse
          key={angle}
          cx="50"
          cy="28"
          rx="9"
          ry="22"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="7" className="accent" />
    </>
  );
}

function Star() {
  return (
    <>
      <path d="M50 14 L61 39 L88 42 L68 61 L73 88 L50 74 L27 88 L32 61 L12 42 L39 39 Z" />
      <path d="M50 34 L56 47 L69 49 L59 58 L62 71 L50 64 L38 71 L41 58 L31 49 L44 47 Z" className="accent" />
    </>
  );
}

function Note() {
  return (
    <>
      <path d="M40 76 L40 20" />
      <path d="M40 20 C60 25 70 35 64 52" />
      <ellipse cx="31" cy="76" rx="13" ry="9" transform="rotate(-18 31 76)" />
      <path d="M62 74 L82 74 M66 68 L66 80 M78 68 L78 80" className="accent" />
    </>
  );
}

function Wave() {
  return (
    <>
      <path d="M14 38 C27 25 40 51 53 38 C66 25 79 51 92 38" />
      <path d="M14 54 C27 41 40 67 53 54 C66 41 79 67 92 54" className="accent" />
      <path d="M14 70 C27 57 40 83 53 70 C66 57 79 83 92 70" />
    </>
  );
}

const EMBLEMS: Record<CrewMate["emblem"], () => React.JSX.Element> = {
  hat: Hat,
  swords: Swords,
  compass: Compass,
  slingshot: Slingshot,
  flame: Flame,
  antlers: Antlers,
  flower: Flower,
  star: Star,
  note: Note,
  wave: Wave,
};

export function CrewEmblem({ variant }: { variant: CrewMate["emblem"] }) {
  const Glyph = EMBLEMS[variant];

  return (
    <svg
      viewBox="0 0 100 100"
      className="[&_.accent]:stroke-crimson h-full w-full [&_*]:fill-none [&_*]:stroke-current [&_*]:[stroke-linecap:round] [&_*]:[stroke-linejoin:round] [&_*]:[stroke-width:2.2]"
      aria-hidden="true"
    >
      <Glyph />
    </svg>
  );
}
