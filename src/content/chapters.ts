export type Stat = {
  /** o numeral — sempre o objeto gráfico principal do bloco */
  value: string;
  unit?: string;
  label: string;
};

export type Chapter = {
  key: string;
  /** 01..05 — aparece no kicker e na nav */
  index: string;
  /** o nome desenhado em stencil no painel de abertura */
  title: string;
  /** rótulo curto pra nav */
  nav: string;
  kicker: string;
  /** manchete do painel largo — sobe letra a letra */
  heading: string;
  /**
   * A mesma manchete partida em TRÊS linhas de cinema, com uma delas
   * "quente" (na cor do capítulo). Três elementos separados porque o
   * splitter achata HTML interno — a cor precisa morar no elemento da
   * linha, não num <span> que seria destruído.
   */
  headline: { lines: [string, string, string]; hot: number };
  /** índices do cluster usados pelas duas paredes de mídia (aberto/médio) */
  wall: { wide: number; mid: number };
  /** parágrafo que se revela palavra a palavra amarrado ao scroll */
  lead: string;
  /** legenda da mídia em sangria */
  caption: string;
  /** o numeral gigante do painel de abertura */
  hero: Stat;
  /** os três dados que deslizam por cima do vídeo/foto */
  stats: [Stat, Stat, Stat];
  /**
   * O capítulo fala em DIÁLOGO (só a EXECUÇÃO): o lead vira uma fala em
   * serif grande (a voz do Roger) em vez de parágrafo corrido, com o
   * crédito embaixo.
   */
  voiceLead?: { quem: string };
  /**
   * Frase-fecho GRANDE que sobe com parallax sobre a mídia aberta, no lugar
   * dos três stats — a última imagem do capítulo carrega a última frase.
   */
  finale?: string;
  images: {
    /**
     * Vídeo em sangria — o ativo que sustenta o painel de mídia.
     * A foto `full` continua existindo e vira o `poster`: nunca há buraco
     * enquanto o vídeo carrega, e quem tem dados limitados vê a foto.
     */
    video: string;
    /** sangria total — abre de letterbox pra tela cheia */
    full: string;
    /** cluster editorial do painel largo, em recorte letterbox */
    cluster: [string, string, string];
    alt: {
      full: string;
      cluster: [string, string, string];
    };
  };
  color: {
    /**
     * Fundo do capítulo — campo de cor CHAPADO e saturado, não mais uma
     * variação de preto.
     *
     * A primeira versão usava #0e1511, #191207, #1c0c06… cinco quase-pretos
     * indistinguíveis, e o site inteiro lia como um tom só. Cor é o que faz
     * cada capítulo ter identidade e o que dá ao scroll a sensação de
     * atravessar lugares. A progressão aqui é a própria jornada: verde de
     * montanha, ocre de sol, brasa, cobre moído e, no fim, a mesa clara.
     */
    bg: string;
    /** tinta principal sobre esse fundo */
    ink: string;
    /** acento — numerais vazados, filetes, hover */
    accent: string;
    /** cor que a nav assume enquanto o capítulo está em cena */
    nav: string;
    /**
     * `difference` faz o título inverter contra a mídia. Só nos capítulos de
     * fundo escuro e vídeo escuro: sobre campo claro ou saturado a inversão
     * embarra e vira sujeira.
     */
    blend: boolean;
  };
};

export const CHAPTERS: Chapter[] = [
  {
    key: "execucao", index: "01", title: "EXECUÇÃO", nav: "Execução", kicker: "A palavra",
    // O capítulo inteiro é o diálogo do cadafalso, uma fala por imagem:
    // a multidão pergunta na parede aberta, o Roger responde em serif
    // grande na parede do close, e a mídia fecha com o início da era.
    heading: "— O One Piece… o tesouro dele existe mesmo?!",
    headline: { lines: ["— O One Piece…", "o tesouro dele", "existe mesmo?!"], hot: 2 },
    wall: { wide: 0, mid: 1 },
    lead: "Minhas riquezas? Se quiserem, podem pegar. Procurem! Eu deixei tudo naquele lugar.",
    voiceLead: { quem: "Gol D. Roger, no cadafalso" },
    finale: "E a Grande Era dos Piratas começou.",
    caption: "Loguetown, a praça da execução — onde tudo começou e terminou.",
    hero: { value: "22", unit: "anos", label: "Do cadafalso ao barco a remo" },
    stats: [
      { value: "22", unit: "anos", label: "Até o garoto zarpar" },
      { value: "1", label: "Frase no cadafalso" },
      { value: "17", unit: "anos", label: "O garoto do chapéu" },
    ],
    images: {
      video: "/shot/execucao/full.mp4", full: "/shot/execucao/full.webp",
      cluster: ["/shot/execucao/a.webp", "/shot/execucao/b.webp", "/shot/execucao/c.webp"],
      alt: {
        full: "A praça de Loguetown sob chuva fina, multidão diante do cadafalso ao longe.",
        cluster: [
          "Multidão apinhada na praça de execução, vista de cima.",
          "O sorriso do rei dos piratas no cadafalso, em close pictórico.",
          "Jornais voando e navios zarpando de um porto ao amanhecer.",
        ],
      },
    },
    color: { bg: "#212a36", ink: "#edf1f7", accent: "#e05548", nav: "#e05548", blend: true },
  },
  {
    key: "tripulacao", index: "02", title: "TRIPULAÇÃO", nav: "Tripulação", kicker: "Os dez",
    heading: "Dez pessoas, um mastro, um chapéu.",
    headline: { lines: ["Dez pessoas,", "um mastro,", "um chapéu."], hot: 2 },
    wall: { wide: 1, mid: 2 },
    lead: "Um espadachim que se perdeu, uma navegadora que odiava piratas, um atirador covarde, um cozinheiro que alimenta inimigo, um médico rejeitado, uma arqueóloga procurada, um carpinteiro sem corpo, um músico sem ninguém, um timoneiro do mar de baixo. Nenhum deles foi recrutado. Todos foram salvos — e escolheram ficar.",
    caption: "O convés ao meio-dia — a mesa onde cabem dez sonhos.",
    hero: { value: "10", label: "Tripulantes a bordo" },
    stats: [
      { value: "10", label: "Tripulantes" },
      { value: "5", label: "Mares de origem" },
      { value: "1", label: "Capitão" },
    ],
    images: {
      video: "/shot/tripulacao/full.mp4", full: "/shot/tripulacao/full.webp",
      cluster: ["/shot/tripulacao/a.webp", "/shot/tripulacao/b.webp", "/shot/tripulacao/c.webp"],
      alt: {
        full: "Navio pirata a vela cruzando um mar ensolarado, visto de longe.",
        cluster: [
          "Chapéu de palha com fita vermelha em close, sobre madeira de convés.",
          "Banquete barulhento no convés à noite, lanternas acesas.",
          "Vela principal com a caveira sorridente, enfunada ao vento.",
        ],
      },
    },
    color: { bg: "#8a6a1a", ink: "#fdf6e0", accent: "#ffd97a", nav: "#ffd97a", blend: false },
  },
  {
    key: "rota", index: "03", title: "ROTA", nav: "Rota", kicker: "O mapa",
    heading: "O mapa acaba, o mar continua.",
    headline: { lines: ["O mapa acaba,", "o mar", "continua."], hot: 1 },
    wall: { wide: 0, mid: 2 },
    lead: "Dois anéis cortam o mundo: uma parede de terra e um mar que enlouquece bússolas. Entra-se por uma montanha que engole navios e, no meio do caminho, desce-se dez mil metros para atravessar por baixo o que não se atravessa por cima. A última ilha não está em mapa nenhum.",
    caption: "A Grand Line — onde bússola comum aponta pra lugar nenhum.",
    hero: { value: "10000", unit: "m", label: "O mergulho sob a Red Line" },
    stats: [
      { value: "10000", unit: "m", label: "Mergulho" },
      { value: "21", label: "Ilhas na rota" },
      { value: "2", label: "Anéis no mundo" },
    ],
    images: {
      video: "/shot/rota/full.mp4", full: "/shot/rota/full.webp",
      cluster: ["/shot/rota/a.webp", "/shot/rota/b.webp", "/shot/rota/c.webp"],
      alt: {
        full: "Mar revolto em tempestade com um farol de rota ao longe.",
        cluster: [
          "Corrente vertical de água subindo a montanha reversa.",
          "Uma bússola de vidro no pulso, apontando para cima.",
          "O abismo do mar profundo com luzes de uma cidade submersa.",
        ],
      },
    },
    color: { bg: "#123c58", ink: "#e9f4f9", accent: "#7adcec", nav: "#7adcec", blend: true },
  },
  {
    key: "guerras", index: "04", title: "GUERRAS", nav: "Guerras", kicker: "As bandeiras",
    heading: "Algumas bandeiras queimaram primeiro.",
    headline: { lines: ["Algumas", "bandeiras", "queimaram."], hot: 2 },
    wall: { wide: 1, mid: 0 },
    lead: "Uma bandeira queimada num tribunal que nunca absolveu ninguém. Uma guerra onde o homem mais forte do mundo morreu de pé, sem um único ferimento nas costas. Um país que esperou vinte anos por uma vingança marcada. As guerras desta história não são sobre território — são sobre o direito de existir.",
    caption: "Marineford — a guerra que ninguém venceu.",
    hero: { value: "20", unit: "anos", label: "A espera de Wano" },
    stats: [
      { value: "20", unit: "anos", label: "A espera de Wano" },
      { value: "1", label: "Bandeira queimada" },
      { value: "0", label: "Feridas nas costas" },
    ],
    images: {
      video: "/shot/guerras/full.mp4", full: "/shot/guerras/full.webp",
      cluster: ["/shot/guerras/a.webp", "/shot/guerras/b.webp", "/shot/guerras/c.webp"],
      alt: {
        full: "Campo de batalha naval em chamas, fumaça cobrindo o céu.",
        cluster: [
          "Bandeira pirata em chamas contra o céu escuro.",
          "Guerreiros em silhueta avançando entre cinzas.",
          "Muralha de fortaleza com canhões, vista de baixo.",
        ],
      },
    },
    color: { bg: "#671710", ink: "#fdeade", accent: "#ff9b6e", nav: "#ff9b6e", blend: true },
  },
  {
    key: "amanhecer", index: "05", title: "AMANHECER", nav: "Amanhecer", kicker: "A herança",
    heading: "A vontade passa de mão em mão.",
    headline: { lines: ["A vontade", "passa de mão", "em mão."], hot: 0 },
    wall: { wide: 2, mid: 1 },
    lead: "Um século apagado dos livros, um nome proibido de existir, uma vontade que atravessa gerações trocando de dono como um chapéu de palha. O tesouro tem nome, tem lugar e tem dono — mas a resposta de verdade nunca foi o que está lá no fim. É quem chega junto. O amanhecer que alguém prometeu ainda vem.",
    caption: "O primeiro sol depois da tempestade — o amanhecer prometido.",
    hero: { value: "100", unit: "anos", label: "O século que apagaram" },
    stats: [
      { value: "100", unit: "anos", label: "Século Vazio" },
      { value: "2", unit: "anos", label: "De treino — 3D2Y" },
      { value: "1", label: "Tesouro no fim" },
    ],
    images: {
      video: "/shot/amanhecer/full.mp4", full: "/shot/amanhecer/full.webp",
      cluster: ["/shot/amanhecer/a.webp", "/shot/amanhecer/b.webp", "/shot/amanhecer/c.webp"],
      alt: {
        full: "Amanhecer dourado sobre mar calmo, luz varrendo a água.",
        cluster: [
          "Gaivotas em contraluz contra o sol nascente.",
          "Chapéu de palha pousado na proa contra o amanhecer.",
          "Linha do horizonte dourada com nuvens altas.",
        ],
      },
    },
    color: { bg: "#ecdfc8", ink: "#191310", accent: "#b0451f", nav: "#b0451f", blend: false },
  },
];
export const NEUTRAL_NAV = "#f5b740";
