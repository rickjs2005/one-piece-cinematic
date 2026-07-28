export type Island = {
  id: string;
  name: string;
  note?: string;
  /** Coordenadas no viewBox 0 0 1000 440 do mapa. */
  x: number;
  y: number;
  /** Marcos: ponto maior, nome em corpo grande e legenda visível. */
  major?: boolean;
  /** Lado do rótulo. Sem isso os nomes se empilham no Novo Mundo. */
  below?: boolean;
};

/**
 * A rota sobre a geografia real do mundo.
 *
 * O mundo é uma esfera cortada por dois anéis perpendiculares: a Red Line
 * (parede de terra, vertical) e a Grand Line (mar, horizontal). Eles se
 * cruzam em dois pontos — Reverse Mountain, por onde se entra, e Mary Geoise,
 * no alto da Red Line. Os dois cruzamentos dividem o resto do mar nos quatro
 * Blues.
 *
 * Como os dois anéis são círculos, achatar isso em um retângulo faz a Red Line
 * aparecer DUAS vezes (é a mesma parede, vista dos dois lados do mapa) e a
 * Grand Line continuar para além da borda direita. É a mesma convenção do mapa
 * publicado na obra.
 *
 * O trecho que mais importa aqui é o mergulho: Sabaody fica encostada na Red
 * Line, e não se atravessa a parede — desce-se 10.000 metros até a Ilha dos
 * Homens-Peixe e sobe-se do outro lado, já no Novo Mundo. Por isso a rota faz
 * aquele mergulho para baixo no meio do mapa.
 */

/** Geometria do mundo, em coordenadas do viewBox. */
export const WORLD = {
  grandLine: { top: 180, bottom: 250 },
  calmBeltTop: { top: 145, bottom: 180 },
  calmBeltBottom: { top: 250, bottom: 285 },
  redLineLeft: { left: 165, right: 198 },
  redLineRight: { left: 742, right: 775 },
  height: 440,
  width: 1000,
};

export const SEAS = [
  { name: "West Blue", x: 82, y: 80 },
  { name: "East Blue", x: 82, y: 360 },
  { name: "North Blue", x: 460, y: 80 },
  { name: "South Blue", x: 460, y: 360 },
];

export const ROUTE: Island[] = [
  { id: "foosha", name: "Vila Foosha", note: "O chapéu emprestado", x: 55, y: 370, major: true, below: true },
  { id: "baratie", name: "Baratie", x: 95, y: 330 },
  { id: "arlong", name: "Arlong Park", x: 128, y: 368, below: true },
  { id: "loguetown", name: "Loguetown", note: "Onde tudo começou e terminou", x: 150, y: 292, major: true },
  { id: "reverse", name: "Reverse Mountain", note: "A entrada", x: 181, y: 215, major: true },
  { id: "whisky", name: "Whisky Peak", x: 228, y: 228, below: true },
  { id: "alabasta", name: "Alabasta", note: "Um reino inteiro", x: 295, y: 200, major: true },
  { id: "skypiea", name: "Skypiea", x: 355, y: 120 },
  { id: "jaya", name: "Jaya", x: 392, y: 232, below: true },
  { id: "water7", name: "Water Seven", x: 455, y: 205 },
  { id: "enies", name: "Enies Lobby", note: "A bandeira queimada", x: 512, y: 228, major: true, below: true },
  { id: "thriller", name: "Thriller Bark", x: 572, y: 200 },
  { id: "sabaody", name: "Sabaody", note: "A separação", x: 715, y: 220, major: true },
  { id: "fishman", name: "Ilha dos Homens-Peixe", note: "10.000 m abaixo da Red Line", x: 758, y: 345, major: true, below: true },
  // No Novo Mundo as ilhas ficam apertadas: os rótulos alternam estritamente
  // acima e abaixo, senão nomes vizinhos caem na mesma linha e se cruzam.
  { id: "punkhazard", name: "Punk Hazard", x: 798, y: 208 },
  { id: "dressrosa", name: "Dressrosa", x: 832, y: 234, below: true },
  { id: "wholecake", name: "Whole Cake", x: 868, y: 200 },
  // Sem legenda: no aperto do Novo Mundo ela caía em cima de Laugh Tale, e
  // esse contexto já é contado por extenso na seção da Jornada.
  { id: "wano", name: "Wano", x: 904, y: 232, major: true, below: true },
  { id: "egghead", name: "Egghead", x: 938, y: 202 },
  { id: "laughtale", name: "Laugh Tale", note: "Não revelado", x: 968, y: 230, major: true, below: true },
];

/**
 * Traçado suave passando por todos os pontos (spline Catmull-Rom convertida
 * para curvas de Bézier).
 *
 * A versão anterior usava pontos de controle no meio horizontal, o que só
 * funciona quando a rota avança sempre para o lado. Aqui ela mergulha na
 * vertical em Sabaody → Ilha dos Homens-Peixe, e aquele método produzia um S
 * torto; a spline resolve os dois casos com a mesma fórmula.
 */
export const ROUTE_PATH = (() => {
  const p = ROUTE;
  let d = `M ${p[0].x} ${p[0].y}`;

  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;

    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x} ${p2.y}`;
  }

  return d;
})();
