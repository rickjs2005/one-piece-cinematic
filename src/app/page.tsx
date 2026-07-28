import { ThroneHero } from "@/components/hero/ThroneHero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Era } from "@/components/sections/Era";
import { Crew } from "@/components/sections/Crew";
import { FlagReveal } from "@/components/sections/FlagReveal";
import { Moments } from "@/components/sections/Moments";
import { Voices } from "@/components/sections/Voices";
import { Footer } from "@/components/sections/Footer";
import { Marquee } from "@/components/ui/Marquee";

export default function Home() {
  return (
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
      <Moments />
      <Voices />
      <Footer />
    </main>
  );
}
