"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo.webp"
            alt="Termoidraulica Lotito"
            width={240}
            height={120}
            className="h-20 w-auto object-contain"
            priority
          />
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600">
          <a href="#servizi" className="hover:text-brand-green transition-colors">Servizi</a>
          <a href="#vantaggi" className="hover:text-brand-green transition-colors">Perché sceglierci</a>
          <a href="#contatti" className="hover:text-brand-green transition-colors">Contatti</a>
        </nav>

        {/* CTA desktop */}
        <div className="hidden md:block">
          <Link
            href="/request"
            className="inline-flex items-center gap-2 bg-brand-green text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-green-dark transition-colors"
          >
            Richiedi preventivo
          </Link>
        </div>

        {/* Hamburger mobile */}
        <button
          className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          onClick={() => setOpen(!open)}
          aria-label="Apri menu"
        >
          {open ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4">
          <a href="#servizi" className="text-sm font-medium text-gray-700 hover:text-brand-green" onClick={() => setOpen(false)}>Servizi</a>
          <a href="#vantaggi" className="text-sm font-medium text-gray-700 hover:text-brand-green" onClick={() => setOpen(false)}>Perché sceglierci</a>
          <a href="#contatti" className="text-sm font-medium text-gray-700 hover:text-brand-green" onClick={() => setOpen(false)}>Contatti</a>
          <Link
            href="/request"
            className="inline-flex justify-center bg-brand-green text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-green-dark transition-colors"
            onClick={() => setOpen(false)}
          >
            Richiedi preventivo
          </Link>
        </div>
      )}
    </header>
  );
}
