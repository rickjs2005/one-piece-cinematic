import { ThroneHero } from "@/components/hero/ThroneHero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Era } from "@/components/sections/Era";
import { Crew } from "@/components/sections/Crew";
import { Moments } from "@/components/sections/Moments";
import { Voices } from "@/components/sections/Voices";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <ThroneHero />
      <Manifesto />
      <Era />
      <Crew />
      <Moments />
      <Voices />
      <Footer />
    </main>
  );
}
