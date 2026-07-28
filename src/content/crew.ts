import type { StaticImageData } from "next/image";
import luffy from "../../public/art/crew-luffy.webp";
import zoro from "../../public/art/crew-zoro.webp";
import nami from "../../public/art/crew-nami.webp";
import usopp from "../../public/art/crew-usopp.webp";
import sanji from "../../public/art/crew-sanji.webp";
import chopper from "../../public/art/crew-chopper.webp";
import robin from "../../public/art/crew-robin.webp";
import franky from "../../public/art/crew-franky.webp";
import brook from "../../public/art/crew-brook.webp";
import jinbe from "../../public/art/crew-jinbe.webp";

export type CrewMate = {
  id: string;
  name: string;
  role: string;
  bounty: string;
  dream: string;
  quote: string;
  portrait: StaticImageData;
};

export const CREW: CrewMate[] = [
  {
    id: "luffy",
    name: "Monkey D. Luffy",
    role: "Capitão",
    bounty: "3.000.000.000",
    dream: "Ser o Rei dos Piratas",
    quote: "Eu vou ser o Rei dos Piratas!",
    portrait: luffy,
  },
  {
    id: "zoro",
    name: "Roronoa Zoro",
    role: "Espadachim",
    bounty: "1.111.000.000",
    dream: "Ser o maior espadachim do mundo",
    quote: "Não aconteceu nada.",
    portrait: zoro,
  },
  {
    id: "nami",
    name: "Nami",
    role: "Navegadora",
    bounty: "366.000.000",
    dream: "Desenhar o mapa do mundo inteiro",
    quote: "Luffy… me ajuda.",
    portrait: nami,
  },
  {
    id: "usopp",
    name: "Usopp",
    role: "Atirador",
    bounty: "500.000.000",
    dream: "Virar um bravo guerreiro do mar",
    quote: "Eu sou o homem que vai virar um bravo guerreiro do mar!",
    portrait: usopp,
  },
  {
    id: "sanji",
    name: "Vinsmoke Sanji",
    role: "Cozinheiro",
    bounty: "1.032.000.000",
    dream: "Encontrar o All Blue",
    quote: "Um cozinheiro não deixa ninguém passar fome. Nem um inimigo.",
    portrait: sanji,
  },
  {
    id: "chopper",
    name: "Tony Tony Chopper",
    role: "Médico",
    bounty: "1.000",
    dream: "Curar qualquer doença do mundo",
    quote: "Eu quero ser um monstro que ajuda as pessoas!",
    portrait: chopper,
  },
  {
    id: "robin",
    name: "Nico Robin",
    role: "Arqueóloga",
    bounty: "930.000.000",
    dream: "Descobrir a História Verdadeira",
    quote: "Eu quero viver!",
    portrait: robin,
  },
  {
    id: "franky",
    name: "Franky",
    role: "Carpinteiro",
    bounty: "394.000.000",
    dream: "Construir o navio que dá a volta ao mundo",
    quote: "SUPER!",
    portrait: franky,
  },
  {
    id: "brook",
    name: "Brook",
    role: "Músico",
    bounty: "383.000.000",
    dream: "Reencontrar Laboon",
    quote: "Yohohoho!",
    portrait: brook,
  },
  {
    id: "jinbe",
    name: "Jinbe",
    role: "Timoneiro",
    bounty: "1.100.000.000",
    dream: "Um mar onde humanos e homens-peixe convivam",
    quote: "Pare de contar o que perdeu. O que sobrou pra você?",
    portrait: jinbe,
  },
];
