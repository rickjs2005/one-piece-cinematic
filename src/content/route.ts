export type Island = {
  id: string;
  name: string;
  sea: string;
  note: string;
  /**
   * Coordenadas no viewBox 0 0 1000 320 do mapa.
   *
   * A faixa vertical é curta de propósito: o mapa vive numa tira larga e
   * baixa dentro do palco fixo. Com um traçado mais alto, o SVG ficava
   * letterboxado no meio da tela e desperdiçava metade da largura.
   */
  x: number;
  y: number;
  /** Marcos maiores no traçado: entram com ponto grande e rótulo permanente. */
  major?: boolean;
};

/**
 * A rota, de East Blue até o fim do mapa.
 *
 * As posições não copiam a geografia oficial — são um traçado desenhado para
 * ler bem em tela larga, subindo e descendo para dar ritmo ao scroll. O que é
 * fiel é a ordem.
 */
export const ROUTE: Island[] = [
  { id: "foosha", name: "Vila Foosha", sea: "East Blue", note: "O chapéu emprestado", x: 45, y: 251, major: true },
  { id: "baratie", name: "Baratie", sea: "East Blue", note: "O juramento", x: 130, y: 197 },
  { id: "arlong", name: "Arlong Park", sea: "East Blue", note: "O pedido", x: 205, y: 258 },
  { id: "loguetown", name: "Loguetown", sea: "East Blue", note: "Onde tudo começou e terminou", x: 290, y: 163, major: true },
  { id: "reverse", name: "Reverse Mountain", sea: "Grand Line", note: "A entrada", x: 375, y: 82, major: true },
  { id: "alabasta", name: "Alabasta", sea: "Grand Line", note: "Um reino inteiro", x: 445, y: 163 },
  { id: "skypiea", name: "Skypiea", sea: "Céu", note: "A ilha que ninguém acreditava", x: 505, y: 55 },
  { id: "water7", name: "Water Seven", sea: "Grand Line", note: "O navio novo", x: 565, y: 150 },
  { id: "enies", name: "Enies Lobby", sea: "Grand Line", note: "A bandeira queimada", x: 630, y: 211, major: true },
  { id: "thriller", name: "Thriller Bark", sea: "Grand Line", note: "Nada aconteceu", x: 695, y: 136 },
  { id: "sabaody", name: "Sabaody", sea: "Grand Line", note: "A separação", x: 745, y: 218 },
  { id: "marineford", name: "Marineford", sea: "Grand Line", note: "A guerra dos melhores", x: 800, y: 96, major: true },
  { id: "fishman", name: "Ilha dos Homens-Peixe", sea: "10.000 m", note: "O reencontro", x: 845, y: 265 },
  { id: "dressrosa", name: "Dressrosa", sea: "Novo Mundo", note: "As cordas cortadas", x: 885, y: 177 },
  { id: "wholecake", name: "Whole Cake", sea: "Novo Mundo", note: "De joelhos na chuva", x: 915, y: 251 },
  { id: "wano", name: "Wano", sea: "Novo Mundo", note: "Vinte anos de espera", x: 940, y: 123, major: true },
  { id: "egghead", name: "Egghead", sea: "Novo Mundo", note: "A ilha do futuro", x: 962, y: 197 },
  { id: "laughtale", name: "Laugh Tale", sea: "Fim do mapa", note: "Não revelado", x: 980, y: 55, major: true },
];

/** Traçado suave passando por todas as ilhas, na ordem. */
export const ROUTE_PATH = ROUTE.reduce((path, island, index) => {
  if (index === 0) return `M ${island.x} ${island.y}`;
  const prev = ROUTE[index - 1];
  // Curva com pontos de controle no meio horizontal: dá o serpenteado de
  // carta náutica sem precisar de coordenadas de controle à mão.
  const midX = (prev.x + island.x) / 2;
  return `${path} C ${midX} ${prev.y}, ${midX} ${island.y}, ${island.x} ${island.y}`;
}, "");
