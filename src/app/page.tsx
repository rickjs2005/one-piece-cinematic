import { ThroneHero } from "@/components/hero/ThroneHero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Elders } from "@/components/sections/Elders";
import { Timeline } from "@/components/sections/Timeline";
import { Lore } from "@/components/sections/Lore";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <ThroneHero />
      <Manifesto />
      <Elders />
      <Timeline />
      <Lore />
      <Footer />
    </main>
  );
}
