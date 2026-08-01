import { ChapterSection } from "@/components/chapter";
import { CrewPanel, MapPanel } from "@/components/chapter-extras";
import { Falas } from "@/components/falas";
import { Intro } from "@/components/intro";
import { Nav } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteShell } from "@/components/site-shell";
import { ThroneHero } from "@/components/hero/ThroneHero";
import { CHAPTERS } from "@/content/chapters";

const EXTRAS: Record<string, React.ReactNode> = {
  tripulacao: <CrewPanel />,
  rota: <MapPanel />,
};

export default function Home() {
  return (
    <SiteShell>
      <Nav />
      <main id="topo">
        <ThroneHero />
        <Intro />
        {CHAPTERS.map((chapter, i) => (
          <ChapterSection key={chapter.key} chapter={chapter} first={i === 0} extra={EXTRAS[chapter.key]} />
        ))}
        <Falas />
      </main>
      <SiteFooter />
    </SiteShell>
  );
}
