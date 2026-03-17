import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-brand-dark">
      {/* Sfondo gradiente + pattern tecnico */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #1E7B2E 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, #28B4D8 0%, transparent 40%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-32 pt-40">
        <div className="max-w-3xl">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 bg-brand-green/20 text-brand-blue border border-brand-blue/30 text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
            style={{ animation: "fadeIn 0.6s ease both" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-blue inline-block" />
            Servizio professionale dal 1991 — Andria (BT)
          </div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            style={{ animation: "fadeInUp 0.7s ease 0.1s both" }}
          >
            Soluzioni termoidrauliche{" "}
            <span className="text-brand-blue">su misura</span>{" "}
            per casa e azienda
          </h1>

          {/* Sottotitolo */}
          <p
            className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-10 max-w-2xl"
            style={{ animation: "fadeInUp 0.7s ease 0.2s both" }}
          >
            Dalla progettazione all&apos;installazione, dalla manutenzione alla video ispezione:
            un unico interlocutore affidabile per tutti gli impianti idraulici, termici e di condizionamento.
          </p>

          {/* CTA buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4"
            style={{ animation: "fadeInUp 0.7s ease 0.3s both" }}
          >
            <Link
              href="/request"
              className="inline-flex items-center justify-center gap-2 bg-brand-green text-white font-semibold px-8 py-4 rounded-xl text-base hover:bg-brand-green-dark transition-colors shadow-lg shadow-brand-green/30"
            >
              Richiedi preventivo gratuito
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href="#servizi"
              className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl text-base hover:bg-white/20 transition-colors"
            >
              Scopri i servizi
            </a>
          </div>

          {/* Stats */}
          <div
            className="mt-14 grid grid-cols-3 gap-6 max-w-lg"
            style={{ animation: "fadeInUp 0.7s ease 0.4s both" }}
          >
            {[
              { value: "35+", label: "anni di esperienza" },
              { value: "2.000+", label: "impianti realizzati" },
              { value: "48h", label: "intervento garantito" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-brand-blue">{stat.value}</div>
                <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Onda di transizione */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
