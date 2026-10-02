// En el subdominio, '/' lo reescribe el middleware a /endurance: se usa <a> normal
// para que la navegación pase siempre por el servidor.
/* eslint-disable @next/next/no-html-link-for-pages */
// Plantilla de las páginas legales del evento (privacidad, exoneración)
export default function LegalPage({ eyebrow, title, updated, children }: { eyebrow: string; title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <header className="eal-nav eal-nav-static">
        <a href="/" className="eal-brand" aria-label="Endurance at the Limit, inicio">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/endurance/logo-nav.webp" alt="Endurance at the Limit" width={240} height={212} />
        </a>
        <a href="/" className="eal-link">← Volver al evento</a>
      </header>
      <main className="eal-section eal-legal">
        <div className="eal-container eal-legal-inner">
          <p className="eal-eyebrow">{eyebrow}</p>
          <h1 className="eal-display eal-h2">{title}</h1>
          <p className="eal-legal-updated">Última actualización: {updated}</p>
          {children}
        </div>
      </main>
    </>
  );
}
