import type { StaticImageData } from "next/image";
import roger from "../../public/art/voice-roger.webp";
import shanks from "../../public/art/voice-shanks.webp";
import hiluluk from "../../public/art/voice-hiluluk.webp";
import blackbeard from "../../public/art/voice-blackbeard.webp";
import doflamingo from "../../public/art/voice-doflamingo.webp";
import whitebeard from "../../public/art/voice-whitebeard.webp";
import ace from "../../public/art/voice-ace.webp";
import rayleigh from "../../public/art/voice-rayleigh.webp";
import luffySanji from "../../public/art/voice-luffy-sanji.webp";

export type Voice = {
  id: string;
  /**
   * Primeira metade da fala, quando ela é uma pergunta seguida de resposta.
   * Renderizada menor, acima da frase principal. Achatar esse tipo de fala em
   * uma afirmação só ("um homem morre quando é esquecido") entrega a mesma
   * informação e joga fora a pausa — que é onde a frase machuca.
   */
  lead?: string;
  quote: string;
  speaker: string;
  context: string;
  /** Uma linha sobre por que a fala pesa. Some no mobile. */
  weight: string;
  portrait: StaticImageData;
  /** Token de cor do acento — dá temperatura emocional a cada painel. */
  accent: "gold" | "blood" | "ember" | "surf" | "orchid" | "violet";
};

/**
 * As falas em ordem narrativa, não cronológica: começa no homem que abriu a
 * era e termina na frase mais humana da obra. O arco é começo → herança →
 * morte → sonho → cinismo → verdade → gratidão → continuidade → amizade.
 */
export const VOICES: Voice[] = [
  {
    id: "roger",
    quote: "Minhas riquezas? Se quiserem, podem pegar. Procurem.",
    speaker: "Gol D. Roger",
    context: "No cadafalso de Loguetown",
    weight: "A execução que era para encerrar a pirataria criou a Era dos Piratas.",
    portrait: roger,
    accent: "gold",
  },
  {
    id: "shanks",
    quote: "Devolve esse chapéu quando você virar um grande pirata.",
    speaker: "Shanks, o Ruivo",
    context: "Vila Foosha, onde tudo começou",
    weight: "Um braço por um moleque, e um chapéu que virou promessa.",
    portrait: shanks,
    accent: "ember",
  },
  {
    id: "hiluluk",
    lead: "Quando é que um homem morre?",
    quote: "Quando é esquecido.",
    speaker: "Dr. Hiluluk",
    context: "Drum Island, segundos antes do fim",
    weight: "Ele morreu rindo, de braços abertos, sem nenhum remédio que funcionasse.",
    portrait: hiluluk,
    accent: "surf",
  },
  {
    id: "blackbeard",
    quote: "O sonho das pessoas nunca acaba!",
    speaker: "Marshall D. Teach, o Barba Negra",
    context: "Jaya, para um sonhador que ninguém levava a sério",
    weight: "A frase mais bonita da obra sai da boca do maior vilão dela.",
    portrait: blackbeard,
    accent: "violet",
  },
  {
    id: "doflamingo",
    quote: "Quem vence é que vira a justiça.",
    speaker: "Donquixote Doflamingo",
    context: "Marineford, rindo no meio da guerra",
    weight: "Ele não estava provocando. Estava explicando como o mundo funciona.",
    portrait: doflamingo,
    accent: "orchid",
  },
  {
    id: "whitebeard",
    quote: "O One Piece existe.",
    speaker: "Edward Newgate, o Barba Branca",
    context: "Última frase, de pé, em Marineford",
    weight: "Quatro palavras que largaram o mundo inteiro no mar de novo.",
    portrait: whitebeard,
    accent: "gold",
  },
  {
    id: "ace",
    quote: "Obrigado por terem me amado.",
    speaker: "Portgas D. Ace",
    context: "Marineford",
    weight: "Ele passou a vida perguntando se merecia ter nascido. Morreu sabendo que sim.",
    portrait: ace,
    accent: "blood",
  },
  {
    id: "rayleigh",
    quote: "A vontade das pessoas não pode ser detida.",
    speaker: "Silvers Rayleigh",
    context: "Sabaody, ao imediato do Rei dos Piratas",
    weight: "Governos caem, eras acabam, mas a vontade passa de mão em mão.",
    portrait: rayleigh,
    accent: "surf",
  },
  {
    id: "luffy-sanji",
    quote: "Sem você eu não consigo virar o Rei dos Piratas.",
    speaker: "Monkey D. Luffy, para Sanji",
    context: "Whole Cake Island, ajoelhado na chuva",
    weight:
      "O homem que nunca se ajoelha para ninguém, ajoelhado, para não perder um amigo.",
    portrait: luffySanji,
    accent: "blood",
  },
];
