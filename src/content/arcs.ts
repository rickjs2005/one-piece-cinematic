export type Arc = {
  marker: string;
  name: string;
  description: string;
  /** Arcos ainda não revelados na obra. O card assume isso em vez de inventar. */
  unrevealed?: boolean;
};

export const ARCS: Arc[] = [
  {
    marker: "Prelúdio",
    name: "Reverie",
    description:
      "Os reis do mundo se reúnem em Mary Geoise. Uma pergunta é feita em voz alta e o salão inteiro finge não ter escutado.",
  },
  {
    marker: "Saga Final I",
    name: "Egghead",
    description:
      "A ilha que existe quinhentos anos à frente do próprio mundo. É onde o Governo decide que o futuro também precisa de permissão.",
  },
  {
    marker: "Saga Final II",
    name: "Elbaf",
    description:
      "A terra dos gigantes, onde a força ainda vale mais do que um decreto. O último lugar que o Governo nunca conseguiu assinar.",
  },
  {
    marker: "Saga Final III",
    name: "O Século Vazio",
    description:
      "Cem anos foram arrancados da história do mundo. O que fica de pé quando eles voltarem é o que está em jogo.",
    unrevealed: true,
  },
  {
    marker: "Fim do mapa",
    name: "Laugh Tale",
    description:
      "A ilha no fim de tudo. Um único homem chegou lá, riu, e escolheu morrer sem contar o que viu.",
    unrevealed: true,
  },
];
