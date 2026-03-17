import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden bg-brand-dark px-8 py-16 sm:px-16 text-center">
          {/* Sfondo decorativo */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: `radial-gradient(circle at 10% 50%, #1E7B2E 0%, transparent 45%),
                                radial-gradient(circle at 90% 50%, #28B4D8 0%, transparent 45%)`,
            }}
          />

          <div className="relative">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-green/20 text-brand-blue border border-brand-blue/30 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue inline-block animate-pulse" />
              Risposta entro 24 ore
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
              Pronto a migliorare il tuo impianto?
            </h2>
            <p className="text-gray-300 text-lg max-w-xl mx-auto mb-10">
              Raccontaci il tuo problema o il progetto che hai in mente.
              Il nostro team valuterà la richiesta e ti contatterà con un preventivo su misura, senza impegno.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/request"
                className="inline-flex items-center justify-center gap-2 bg-brand-green text-white font-semibold px-8 py-4 rounded-xl text-base hover:bg-brand-green-dark transition-colors shadow-lg shadow-brand-green/30"
              >
                Invia la tua richiesta
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a
                href="tel:+393395298330"
                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl text-base hover:bg-white/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Chiamaci ora
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
