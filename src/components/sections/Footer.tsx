export function Footer() {
  return (
    <footer className="border-mist/10 border-t px-6 py-16 md:px-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-3xl leading-none">Animes</p>
          <p className="text-mist mt-3 max-w-sm text-sm leading-relaxed">
            Peça cinematográfica sobre O Trono Vazio. Projeto de demonstração,
            sem vínculo com os detentores dos direitos da obra.
          </p>
        </div>

        <div className="text-mist space-y-1 text-sm">
          <p className="label-caps text-parchment/60">Arte de referência</p>
          <p>One Piece — Eiichiro Oda / Toei Animation</p>
          <p>Ilustração do trono: @lasharillo</p>
        </div>
      </div>
    </footer>
  );
}
