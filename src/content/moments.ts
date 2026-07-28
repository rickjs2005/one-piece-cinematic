export type Moment = {
  marker: string;
  place: string;
  title: string;
  description: string;
  /** Arcos ainda em curso na obra. O card assume isso em vez de inventar final. */
  ongoing?: boolean;
};

export const MOMENTS: Moment[] = [
  {
    marker: "Ano 0",
    place: "Loguetown",
    title: "A execução do Rei",
    description:
      "Gol D. Roger morre rindo e diz ao mundo inteiro que deixou tudo o que tinha em algum lugar. Naquele segundo, metade do planeta vira pirata.",
  },
  {
    marker: "East Blue",
    place: "Arlong Park",
    title: "O pedido da Nami",
    description:
      "Oito anos roubando sozinha para comprar a liberdade da própria vila. Quando não sobra mais nada, ela finalmente pede ajuda — e ganha um chapéu de palha na cabeça.",
  },
  {
    marker: "Grand Line",
    place: "Alabasta",
    title: "Um reino inteiro",
    description:
      "Um país morrendo de sede por causa de uma guerra fabricada. É aqui que a tripulação para de ser um bando de amigos e vira um problema para o Governo Mundial.",
  },
  {
    marker: "Guerra",
    place: "Enies Lobby",
    title: "A bandeira queimada",
    description:
      "Seis piratas declaram guerra ao Governo Mundial para resgatar uma pessoa só. Robin passa a vida inteira fugindo e, pela primeira vez, grita que quer viver.",
  },
  {
    marker: "Preço",
    place: "Thriller Bark",
    title: "Nada aconteceu",
    description:
      "Zoro absorve toda a dor do capitão e fica de pé até o amanhecer, coberto do próprio sangue, para que ninguém precise saber. Duas palavras, e o assunto morre ali.",
  },
  {
    marker: "Perda",
    place: "Marineford",
    title: "A guerra dos melhores",
    description:
      "Luffy atravessa o quartel-general da Marinha para salvar o irmão e perde de qualquer jeito. É o arco que ensina que vontade sozinha não basta.",
  },
  {
    marker: "Amanhecer",
    place: "Wano",
    title: "Vinte anos de espera",
    description:
      "Um país fechado, uma promessa de duas décadas e o Imperador que ninguém tinha derrubado. As fronteiras se abrem e o mundo escuta o riso de novo.",
  },
  {
    marker: "Saga Final",
    place: "Egghead · Elbaf",
    title: "O fim do mapa",
    description:
      "A ilha do futuro, a terra dos gigantes, e o Século Vazio esperando no fim da linha. Falta pouco para o mundo descobrir quem está sentado no trono.",
    ongoing: true,
  },
];
