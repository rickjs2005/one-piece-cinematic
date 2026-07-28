import type { Elder } from "@/content/elders";

/**
 * Silhuetas dos Anciães.
 *
 * Não há arte licenciada destes personagens no projeto. Em vez de um retângulo
 * cinza de placeholder ou de uma imagem gerada fingindo ser oficial, cada card
 * recebe uma sombra vetorial com o par de olhos carmesim — honesto sobre o que
 * é, e coerente com a linguagem do hero.
 */

const SHAPES: Record<Elder["silhouette"], string> = {
  // Coroa alta e estreita — a figura do trono.
  crown:
    "M100 200 L100 120 C100 92 84 78 84 54 L92 60 L96 30 L100 52 L104 30 L108 60 L116 54 C116 78 100 92 100 120 Z M100 118 C126 118 142 148 142 200 Z M100 118 C74 118 58 148 58 200 Z",
  // Chifres largos e retos.
  horns:
    "M56 44 L74 74 M144 44 L126 74 M100 200 C64 200 52 166 52 132 C52 100 74 76 100 76 C126 76 148 100 148 132 C148 166 136 200 100 200 Z",
  // Elmo com crista.
  helm: "M100 26 L108 60 L100 54 L92 60 Z M100 200 C66 200 56 168 56 134 C56 102 76 72 100 72 C124 72 144 102 144 134 C144 168 134 200 100 200 Z",
  // Véu longo caindo dos ombros.
  veil: "M100 60 C128 60 140 88 138 116 L150 200 L50 200 L62 116 C60 88 72 60 100 60 Z",
  // Juba volumosa.
  mane: "M100 54 C136 54 156 84 152 122 C168 140 160 200 160 200 L40 200 C40 200 32 140 48 122 C44 84 64 54 100 54 Z",
  // Ombros angulares, cabeça baixa.
  blade:
    "M100 58 C122 58 134 82 130 106 L164 200 L36 200 L70 106 C66 82 78 58 100 58 Z",
};

const EYES: Record<Elder["silhouette"], [number, number]> = {
  crown: [96, 104],
  horns: [92, 108],
  helm: [92, 108],
  veil: [92, 108],
  mane: [90, 110],
  blade: [92, 108],
};

const EYE_Y: Record<Elder["silhouette"], number> = {
  crown: 106,
  horns: 118,
  helm: 116,
  veil: 96,
  mane: 92,
  blade: 92,
};

export function Silhouette({ variant }: { variant: Elder["silhouette"] }) {
  const [leftEye, rightEye] = EYES[variant];
  const eyeY = EYE_Y[variant];

  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <defs>
        <filter
          id={`silGlow-${variant}`}
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <path
        d={SHAPES[variant]}
        fill="#0b070c"
        stroke="var(--color-mist)"
        strokeWidth="0.75"
        strokeOpacity="0.28"
      />

      <g filter={`url(#silGlow-${variant})`}>
        <circle cx={leftEye} cy={eyeY} r="2.6" fill="var(--color-glow)" />
        <circle cx={rightEye} cy={eyeY} r="2.6" fill="var(--color-glow)" />
      </g>
      <circle cx={leftEye} cy={eyeY} r="1.4" fill="var(--color-crimson)" />
      <circle cx={rightEye} cy={eyeY} r="1.4" fill="var(--color-crimson)" />
    </svg>
  );
}
