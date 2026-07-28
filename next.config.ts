import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Menos degraus de tamanho do que o padrão do Next.
     *
     * Com 33 artes na página, a lista padrão gerava 266 variantes: o
     * otimizador levava 82s de CPU na primeira visita e sufocava o navegador.
     * Estes degraus cobrem celular, tablet, notebook e telas grandes — e as
     * artes de origem já foram reduzidas ao tamanho em que aparecem, então
     * degraus acima de 1920 não teriam de onde tirar detalhe.
     */
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [256, 384],
  },
};

export default nextConfig;
