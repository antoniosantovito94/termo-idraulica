import Image from "next/image";

const services = [
  {
    id: 1,
    title: "Impianto idrico, fognante e termico",
    description:
      "Progettazione e realizzazione di impianti idraulici e fognari civili e industriali. Installazione e manutenzione di caldaie, radiatori e sistemi di riscaldamento a pavimento.",
    image: "/servizio_1_Impianto_idrico_fognante_e_termico.png",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M12 2C8.5 2 6 5 6 8c0 4 6 12 6 12s6-8 6-12c0-3-2.5-6-6-6zm0 8a2 2 0 100-4 2 2 0 000 4z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Impianti di condizionamento",
    description:
      "Installazione, sostituzione e manutenzione di sistemi di climatizzazione residenziali e commerciali. Pompe di calore, split e sistemi VRF per ogni esigenza.",
    image: "/servizio_2_area_Impianti_condizionamento.png",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1013 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Impianti industriali",
    description:
      "Realizzazione di impianti termoidraulici per il settore industriale e produttivo. Reti di distribuzione fluidi, sistemi di raffreddamento e centrali termiche.",
    image: "/servizio_3_Impianti_industriali.png",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Video ispezioni",
    description:
      "Ispezione endoscopica di tubature e condotte con telecamera ad alta risoluzione. Diagnosi precisa di ostruzioni, infiltrazioni e anomalie strutturali senza demolizioni.",
    image: "/servizio_4_Video_ispezioni.png",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
      </svg>
    ),
  },
];

export default function ServicesSection() {
  return (
    <section id="servizi" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Intestazione */}
        <div className="text-center mb-14">
          <span className="text-brand-green text-sm font-semibold uppercase tracking-widest">
            Cosa facciamo
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
            I nostri servizi
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto text-base">
            Competenza tecnica e attrezzature moderne per ogni tipo di intervento,
            dal residenziale all&apos;industriale.
          </p>
        </div>

        {/* Griglia 2x2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map((service) => (
            <article
              key={service.id}
              className="group relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 bg-white"
            >
              {/* Immagine */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                {/* Overlay gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Icona in overlay */}
                <div className="absolute bottom-4 left-4 w-10 h-10 rounded-xl bg-brand-green text-white flex items-center justify-center shadow-lg">
                  {service.icon}
                </div>
              </div>

              {/* Contenuto */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-brand-green transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Bordo verde animato in hover */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
