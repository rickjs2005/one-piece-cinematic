export type CrewMate = {
  id: string;
  name: string;
  role: string;
  bounty: string;
  dream: string;
  quote: string;
  /** Emblema vetorial do personagem — ver components/ui/CrewEmblem.tsx */
  emblem:
    | "hat"
    | "swords"
    | "compass"
    | "slingshot"
    | "flame"
    | "antlers"
    | "flower"
    | "star"
    | "note"
    | "wave";
};

export const CREW: CrewMate[] = [
  {
    id: "luffy",
    name: "Monkey D. Luffy",
    role: "Capitão",
    bounty: "3.000.000.000",
    dream: "Ser o Rei dos Piratas",
    quote: "Eu vou ser o Rei dos Piratas!",
    emblem: "hat",
  },
  {
    id: "zoro",
    name: "Roronoa Zoro",
    role: "Espadachim",
    bounty: "1.111.000.000",
    dream: "Ser o maior espadachim do mundo",
    quote: "Não aconteceu nada.",
    emblem: "swords",
  },
  {
    id: "nami",
    name: "Nami",
    role: "Navegadora",
    bounty: "366.000.000",
    dream: "Desenhar o mapa do mundo inteiro",
    quote: "Luffy… me ajuda.",
    emblem: "compass",
  },
  {
    id: "usopp",
    name: "Usopp",
    role: "Atirador",
    bounty: "500.000.000",
    dream: "Virar um bravo guerreiro do mar",
    quote: "Eu sou o homem que vai virar um bravo guerreiro do mar!",
    emblem: "slingshot",
  },
  {
    id: "sanji",
    name: "Vinsmoke Sanji",
    role: "Cozinheiro",
    bounty: "1.032.000.000",
    dream: "Encontrar o All Blue",
    quote: "Um cozinheiro não deixa ninguém passar fome. Nem um inimigo.",
    emblem: "flame",
  },
  {
    id: "chopper",
    name: "Tony Tony Chopper",
    role: "Médico",
    bounty: "1.000",
    dream: "Curar qualquer doença do mundo",
    quote: "Eu quero ser um monstro que ajuda as pessoas!",
    emblem: "antlers",
  },
  {
    id: "robin",
    name: "Nico Robin",
    role: "Arqueóloga",
    bounty: "930.000.000",
    dream: "Descobrir a História Verdadeira",
    quote: "Eu quero viver!",
    emblem: "flower",
  },
  {
    id: "franky",
    name: "Franky",
    role: "Carpinteiro",
    bounty: "394.000.000",
    dream: "Construir o navio que dá a volta ao mundo",
    quote: "SUPER!",
    emblem: "star",
  },
  {
    id: "brook",
    name: "Brook",
    role: "Músico",
    bounty: "383.000.000",
    dream: "Reencontrar Laboon",
    quote: "Yohohoho!",
    emblem: "note",
  },
  {
    id: "jinbe",
    name: "Jinbe",
    role: "Timoneiro",
    bounty: "1.100.000.000",
    dream: "Um mar onde humanos e homens-peixe convivam",
    quote: "Pare de contar o que perdeu. O que sobrou pra você?",
    emblem: "wave",
  },
];
