import { SiteShell } from "@/components/site-shell";
import { Nav } from "@/components/nav";
import { ThroneHero } from "@/components/hero/ThroneHero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Era } from "@/components/sections/Era";
import { Crew } from "@/components/sections/Crew";
import { FlagReveal } from "@/components/sections/FlagReveal";
import { GrandLineMap } from "@/components/sections/GrandLineMap";
import { Moments } from "@/components/sections/Moments";
import { Voices } from "@/components/sections/Voices";
import { Footer } from "@/components/sections/Footer";
import { Marquee } from "@/components/ui/Marquee";

export default function Home() {
  return (
    <SiteShell>
      <Nav />
      <main>
        <ThroneHero />
        <Manifesto />

        <Marquee
          items={[
            "A Era dos Piratas",
            "O Século Vazio",
            "Grand Line",
            "Laugh Tale",
            "D.",
          ]}
        />

        <Era />
        <Crew />

        <Marquee
          reverse
          duration={42}
          items={[
            "Luffy",
            "Zoro",
            "Nami",
            "Usopp",
            "Sanji",
            "Chopper",
            "Robin",
            "Franky",
            "Brook",
            "Jinbe",
          ]}
        />

        <FlagReveal />
        {/* O mapa dá a visão geral da rota; a Jornada logo em seguida entra
            nas paradas que importaram. Invertido, os momentos chegariam sem
            chão. */}
        <GrandLineMap />
        <Moments />
        <Voices />
        <Footer />
      </main>
    </SiteShell>
  );
}
