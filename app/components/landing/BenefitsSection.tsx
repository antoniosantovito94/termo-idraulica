const benefits = [
  {
    title: "Esperienza comprovata",
    description:
      "Operativi dal 1991 nel settore termoidraulico, con migliaia di interventi completati su impianti residenziali, commerciali e industriali in tutta la provincia di Bari.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: "bg-brand-green/10 text-brand-green",
  },
  {
    title: "Intervento rapido",
    description:
      "Garantiamo una risposta entro 48 ore per le richieste ordinarie e un servizio di pronto intervento per le emergenze. Il tuo impianto non si ferma, e nemmeno noi.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: "bg-brand-blue/10 text-brand-blue",
  },
  {
    title: "Materiali certificati",
    description:
      "Utilizziamo esclusivamente componenti e materiali di prima qualità, conformi alle normative vigenti. Ogni lavoro è eseguito a regola d'arte con garanzia sul risultato.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    color: "bg-brand-orange/10 text-brand-orange",
  },
  {
    title: "Preventivo trasparente",
    description:
      "Nessuna sorpresa in fattura. Prima di ogni intervento forniamo un preventivo chiaro e dettagliato, senza costi nascosti. La fiducia del cliente è la nostra priorità.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    color: "bg-brand-green/10 text-brand-green",
  },
];

export default function BenefitsSection() {
  return (
    <section id="vantaggi" className="py-24 bg-brand-gray">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Intestazione */}
        <div className="text-center mb-14">
          <span className="text-brand-green text-sm font-semibold uppercase tracking-widest">
            Perché sceglierci
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
            Affidabilità che si misura nei fatti
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto text-base">
            Ogni progetto è un impegno concreto: verso la qualità, verso il cliente,
            verso il rispetto dei tempi e dei costi concordati.
          </p>
        </div>

        {/* Grid vantaggi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Icona */}
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${benefit.color}`}>
                {benefit.icon}
              </div>

              <h3 className="text-base font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
