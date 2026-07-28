export type Voice = {
  id: string;
  quote: string;
  speaker: string;
  context: string;
};

/**
 * Falas de fora da tripulação — as vozes que empurraram a história.
 * As da tripulação vivem nos cards de `crew.ts` e não se repetem aqui.
 */
export const VOICES: Voice[] = [
  {
    id: "roger",
    quote: "Minhas riquezas? Se quiserem, podem pegar. Procurem.",
    speaker: "Gol D. Roger",
    context: "No cadafalso, segundos antes do fim",
  },
  {
    id: "hiluluk",
    quote: "Um homem morre quando é esquecido.",
    speaker: "Dr. Hiluluk",
    context: "Drum Island",
  },
  {
    id: "whitebeard",
    quote: "O One Piece existe.",
    speaker: "Edward Newgate, o Barba Branca",
    context: "Última frase, em Marineford",
  },
  {
    id: "ace",
    quote: "Obrigado por terem me amado.",
    speaker: "Portgas D. Ace",
    context: "Marineford",
  },
  {
    id: "rayleigh",
    quote: "A vontade das pessoas não pode ser detida.",
    speaker: "Silvers Rayleigh",
    context: "Sabaody",
  },
  {
    id: "shanks",
    quote: "Devolve esse chapéu quando você virar um grande pirata.",
    speaker: "Shanks, o Ruivo",
    context: "Vila Foosha, onde tudo começou",
  },
];
