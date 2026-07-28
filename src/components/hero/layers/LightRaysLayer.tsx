"use client";

/**
 * Feixes volumétricos descendo do teto (z15). Entram junto com o trono.
 *
 * `plus-lighter` faz os feixes somarem luz em vez de cobrir a arte — é o que
 * diferencia um raio de luz de um triângulo branco por cima da imagem.
 */

const RAYS = [
  { x: -170, width: 26, opacity: 0.55, skew: -7 },
  { x: -96, width: 14, opacity: 0.35, skew: -4 },
  { x: -28, width: 34, opacity: 0.6, skew: -1.5 },
  { x: 46, width: 18, opacity: 0.4, skew: 2 },
  { x: 118, width: 28, opacity: 0.5, skew: 5 },
  { x: 196, width: 12, opacity: 0.3, skew: 8 },
];

export function LightRaysLayer() {
  return (
    <div
      data-layer="rays"
      className="pointer-events-none absolute inset-0 z-[15] opacity-0 mix-blend-plus-lighter"
    >
      <svg
        viewBox="-300 0 600 400"
        className="h-full w-full"
        aria-hidden="true"
        preserveAspectRatio="xMidYMin slice"
      >
        <defs>
          <linearGradient id="rayFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dbe7f2" stopOpacity="0.95" />
            <stop offset="55%" stopColor="var(--color-mist)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-mist)" stopOpacity="0" />
          </linearGradient>
          <filter id="raySoften" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
        </defs>

        <g filter="url(#raySoften)">
          {RAYS.map((ray) => (
            <polygon
              key={ray.x}
              points={`${ray.x},0 ${ray.x + ray.width},0 ${
                ray.x + ray.width * 2.4 + ray.skew * 12
              },400 ${ray.x + ray.skew * 12 - ray.width},400`}
              fill="url(#rayFade)"
              opacity={ray.opacity}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
