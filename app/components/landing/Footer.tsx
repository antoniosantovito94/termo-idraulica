import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer id="contatti" className="bg-brand-dark text-gray-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="inline-block bg-white rounded-xl px-2 py-1.5 mb-4">
              <Image
                src="/logo.webp"
                alt="Termoidraulica Lotito"
                width={120}
                height={45}
                className="h-7 w-auto object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Esperienza, qualità e puntualità per ogni tipo di impianto termoidraulico.
              Il tuo impianto in mani sicure dal 1991.
            </p>

            {/* Social placeholder */}
            <div className="flex gap-3 mt-5">
              {["facebook", "instagram"].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-brand-green transition-colors"
                >
                  {s === "facebook" ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={1.8} />
                      <circle cx="12" cy="12" r="4" strokeWidth={1.8} />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" strokeWidth={0} />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Servizi */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Servizi</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                "Impianto idrico e fognante",
                "Impianti termici",
                "Condizionamento",
                "Impianti industriali",
                "Video ispezioni",
              ].map((item) => (
                <li key={item}>
                  <a href="#servizi" className="hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contatti */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Contatti</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-brand-green shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Via O. Evans 46 — 76123 Andria (BT)</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-green shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+393395298330" className="hover:text-white transition-colors">
                  +39 339 529 8330
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-green shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:riccardolotito@pec.it" className="hover:text-white transition-colors">
                  riccardolotito@pec.it
                </a>
              </li>
            </ul>

            <div className="mt-5">
              <Link
                href="/request"
                className="inline-flex items-center gap-1.5 text-sm text-brand-green hover:text-white transition-colors font-medium"
              >
                Richiedi preventivo
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Termoidraulica Lotito. Tutti i diritti riservati.</p>
          <p>P.IVA 04229750726 — Lotito Riccardo</p>
        </div>
      </div>
    </footer>
  );
}
