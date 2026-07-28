export function Footer() {
  return (
    <footer className="border-parchment/10 border-t px-6 py-20 md:px-16">
      <div className="mx-auto max-w-6xl">
        <p className="display text-[clamp(3rem,12vw,10rem)] leading-none">
          Animes
        </p>

        <div className="mt-14 flex flex-col gap-10 md:flex-row md:justify-between">
          <p className="text-fog max-w-sm text-sm leading-relaxed">
            Peça cinematográfica sobre a história de One Piece. Projeto de
            demonstração, sem vínculo com os detentores dos direitos da obra.
          </p>

          <div className="text-fog space-y-1.5 text-sm">
            <p className="label-caps text-parchment/60">Créditos</p>
            <p>One Piece — Eiichiro Oda / Shueisha / Toei Animation</p>
            <p>Ilustrações do site geradas por IA, inspiradas na obra</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
