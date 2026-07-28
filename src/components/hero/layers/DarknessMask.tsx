"use client";

/**
 * A escuridão que envolve a cena (z30) — entre as artes e os olhos.
 *
 * Fica ABAIXO dos olhos de propósito. Os olhos precisam brilhar *através* do
 * breu na abertura; se a máscara ficasse por cima, a tela seria preto liso em
 * 0% de scroll e a Cena 1 simplesmente não existiria.
 *
 * O gradiente é estático e a animação é só `scale` + `opacity`, ambos
 * compositados na GPU. Animar o raio do gradiente daria o mesmo resultado
 * visual repintando a tela inteira a cada frame — caro à toa, principalmente
 * em mobile.
 *
 * A escala só cresce (1 → 1.45), nunca encolhe: assim a camada cobre a
 * viewport inteira em qualquer ponto da timeline. Encolher abriria os cantos e
 * as artes vazariam sem vinheta.
 */
export function DarknessMask() {
  return (
    <div
      data-layer="darkness"
      className="pointer-events-none absolute inset-0 z-30"
      style={{
        background:
          "radial-gradient(circle at 50% 45%, transparent 0%, rgba(3,2,3,0.55) 38%, rgba(3,2,3,0.94) 62%, #030203 80%)",
      }}
    />
  );
}
