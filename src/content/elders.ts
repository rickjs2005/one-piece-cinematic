export type Elder = {
  id: string;
  name: string;
  title: string;
  domain: string;
  line: string;
  /**
   * Silhueta desenhada em SVG. Não existe arte licenciada destes personagens
   * no projeto, então o card é tipográfico — silhueta, nome e título — em vez
   * de um retângulo cinza fingindo ser uma foto.
   */
  silhouette: "crown" | "horns" | "helm" | "veil" | "mane" | "blade";
};

export const ELDERS: Elder[] = [
  {
    id: "imu",
    name: "Imu",
    title: "O Soberano",
    domain: "Trono Vazio",
    line: "Existe há oitocentos anos e não consta em nenhum registro. Os Cinco Anciães se ajoelham.",
    silhouette: "crown",
  },
  {
    id: "saturn",
    name: "Jaygarcia Saturn",
    title: "Ancião Guerreiro",
    domain: "Ciência e Defesa",
    line: "Governa o que a humanidade tem permissão de descobrir — e o que precisa ser apagado.",
    silhouette: "horns",
  },
  {
    id: "mars",
    name: "Marcus Mars",
    title: "Ancião Guerreiro",
    domain: "Ambiente",
    line: "Decide quais ilhas continuam no mapa.",
    silhouette: "helm",
  },
  {
    id: "nusjuro",
    name: "Ethanbaron V. Nusjuro",
    title: "Ancião Guerreiro",
    domain: "Finanças",
    line: "O dinheiro dos setenta reinos atravessa as mãos dele antes de existir.",
    silhouette: "veil",
  },
  {
    id: "peter",
    name: "Shepherd Ju Peter",
    title: "Ancião Guerreiro",
    domain: "Agricultura",
    line: "Controla a fome. Nenhuma arma jamais precisou ser tão silenciosa.",
    silhouette: "mane",
  },
  {
    id: "warcury",
    name: "Topman Warcury",
    title: "Ancião Guerreiro",
    domain: "Justiça",
    line: "A Justiça Absoluta não é um princípio. É uma ordem assinada.",
    silhouette: "blade",
  },
];
