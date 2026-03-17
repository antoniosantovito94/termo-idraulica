# CLAUDE.md — Onboarding sviluppatore

## 1. Overview del progetto

Web app per la gestione delle **richieste di appuntamento** di un'azienda termoidraulica (HVAC). I clienti compilano un form, allegano foto del problema e ricevono una email di conferma. I dati vengono salvati su Supabase.

- **Lingua UI/email:** Italiano
- **Stack:** Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS 4 + Supabase + Nodemailer/Gmail
- **Deploy target:** Vercel (standard Next.js, nessuna config custom)

---

## 2. Architettura

```
Browser
  └── /request         → form cliente (React client component)
        │
        └── POST /api/requests          → salva richiesta + foto + manda email
        └── GET  /api/requests/[id]     → dettaglio singola richiesta

Server-side (Next.js API Routes)
  ├── lib/validators.ts    Zod schemas condivisi client/server
  ├── lib/rateLimit.ts     Rate limiter in-memory (Map)
  ├── lib/supabase.ts      Supabase admin client (service role key)
  └── lib/email.ts         Nodemailer + Gmail SMTP

Database (Supabase PostgreSQL)
  ├── appointment_requests         richiesta principale
  └── appointment_request_photos   metadati foto (path storage)

Storage (Supabase Storage)
  └── bucket: appointment-photos
        └── {requestId}/{filename}-{uuid}.{ext}
```

### Come comunicano i moduli

1. Il form (`app/request/page.tsx`) invia un `FormData` via `fetch` a `POST /api/requests`.
2. L'API route (`app/api/requests/route.ts`) esegue in sequenza:
   - rate limit → validazione → honeypot → file check → DB insert → upload foto → email.
3. L'email viene inviata in modo **non-bloccante**: un errore email non fallisce la richiesta.
4. Il client riceve `{ id }` e mostra la schermata di successo.
5. `GET /api/requests/[id]` è usato per recuperare i dettagli (nessuna UI admin collegata).

---

## 3. Setup locale passo passo

### Prerequisiti
- Node.js >= 18
- Un progetto Supabase (free tier ok)
- Un account Gmail con **App Password** abilitata (non la password principale)

### Passi

```bash
# 1. Clona e installa dipendenze
git clone <repo-url>
cd web_app_termoidraulica
npm install

# 2. Crea il file .env locale
cp .env.example .env
# oppure crea manualmente .env con le variabili sotto

# 3. Avvia in sviluppo
npm run dev
# → http://localhost:3000 (reindirizza a /request)
```

### Variabili d'ambiente (`.env`)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>         # esposta al browser, sicura
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>      # MAI esporre al browser

# Gmail (Nodemailer)
GMAIL_USER=tua-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx            # App Password a 16 caratteri

# URL pubblico (opzionale in dev — serve solo per il logo nelle email)
APP_URL=                                           # es. https://tuodominio.com
```

### Setup Supabase (una tantum)

Eseguire nel SQL editor di Supabase:

```sql
-- Tabella principale
CREATE TABLE appointment_requests (
  id          UUID        PRIMARY KEY,
  first_name  TEXT        NOT NULL,
  last_name   TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  phone       TEXT        NOT NULL,
  description TEXT        NOT NULL,
  status      TEXT        NOT NULL DEFAULT 'presa_in_carico',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabella foto
CREATE TABLE appointment_request_photos (
  id           UUID        PRIMARY KEY,
  request_id   UUID        NOT NULL REFERENCES appointment_requests(id),
  storage_path TEXT        NOT NULL,
  original_name TEXT       NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Storage bucket (da UI Supabase → Storage → New bucket)
-- Nome: appointment-photos
-- Visibilità: private (o public, a seconda dei requisiti)
```

### Gmail App Password

1. Account Google → Sicurezza → Verifica in due passaggi (deve essere attiva)
2. Cerca "Password per le app" → genera per "Mail"
3. Copia la password a 16 caratteri in `GMAIL_APP_PASSWORD`

---

## 4. Flusso di esecuzione

### Invio richiesta (happy path)

```
Cliente compila form
  → click "Invia"
  → fetch POST /api/requests (FormData: campi + file)

API route:
  1. Estrae IP dalla request
  2. Controlla rate limit (max 5/ora per IP, in-memory)
  3. Esegue .formData() e legge i campi
  4. Valida con Zod (lib/validators.ts)
  5. Controlla honeypot (campo nascosto deve essere vuoto)
  6. Valida ogni file (MIME, dimensione ≤10MB, max 10 foto)
  7. Inserisce riga in appointment_requests → ottiene UUID
  8. Carica ogni foto su Supabase Storage
  9. Inserisce metadati in appointment_request_photos
  10. Chiama sendConfirmationEmail() — non-blocking (try/catch con solo log)
  11. Risponde 201 { id: uuid }

Cliente:
  → riceve { id }
  → mostra schermata di successo con ID riferimento
```

### Recupero richiesta

```
GET /api/requests/[id]
  1. Valida formato UUID del parametro
  2. Query su appointment_requests con JOIN appointment_request_photos
  3. Risponde 200 con oggetto completo o 404
```

---

## 5. Dipendenze chiave

| Pacchetto | Versione | Ruolo |
|---|---|---|
| `next` | ^15.2.0 | Framework full-stack (App Router) |
| `react` / `react-dom` | ^19.0.0 | UI |
| `@supabase/supabase-js` | ^2.49.0 | Database + Storage client |
| `zod` | ^3.25.0 | Validazione schemi (client + server) |
| `react-hook-form` | ^7.54.2 | Gestione stato form |
| `@hookform/resolvers` | ^3.9.0 | Bridge react-hook-form ↔ Zod |
| `nodemailer` | ^8.0.1 | Invio email via SMTP Gmail |
| `uuid` | ^11.0.5 | Generazione UUID per richieste e foto |
| `tailwindcss` | ^4.0.0 | CSS utility-first |

> **Nota Tailwind v4:** usa `@tailwindcss/postcss` come plugin, non il vecchio `tailwindcss` in postcss.config. Il file di config è `tailwind.config.ts` ma la maggior parte della configurazione è già in `globals.css` con i layer `@layer base/components`.

---

## 6. Convenzioni di codice

- **Assolute imports:** usa `@/` come alias root (es. `@/lib/validators`)
- **TypeScript strict:** abilitato, no `any` implicito
- **Componenti:** tutti in `app/` (no cartella `components/` al momento)
- **CSS:** classi Tailwind inline + classi componente definite in `globals.css` (`.form-input`, `.btn-primary`, ecc.)
- **Validazione:** sempre doppia — Zod sul client (react-hook-form) e di nuovo sul server (API route)

---

## 7. Problemi noti / codice incompleto

### Dashboard admin assente
Non esiste nessuna UI per visualizzare/gestire le richieste ricevute. `GET /api/requests/[id]` esiste ma non è collegato ad alcuna pagina. Il campo `status` (default `presa_in_carico`) non è modificabile da nessuna interfaccia.

### Rate limiter in-memory
`lib/rateLimit.ts` usa una `Map` in memoria Node.js. **Si azzera ad ogni restart del server** e non funziona in ambienti multi-instance (es. Vercel con più serverless). Per produzione è consigliabile sostituire con Redis o Upstash.

### Nessuna notifica email al titolare
L'email viene inviata solo al cliente. Nessuna email viene inviata all'azienda quando arriva una nuova richiesta.

### RLS Supabase non configurata (unknown)
Non è presente nel codice nessuna gestione di Row Level Security su Supabase. Non è chiaro se le policy siano state configurate direttamente sul progetto Supabase. Verificare prima di andare in produzione.

### APP_URL vuota in sviluppo
Se `APP_URL` è vuota il logo non viene renderizzato nelle email. In locale questo è atteso, ma ricordare di configurarlo in produzione.


1. **Limite 500 righe per file.** Nessun file (componente, route, lib) deve superare le 500 righe. Se un file diventa troppo lungo, spezzarlo in sottocomponenti o funzioni separate prima di continuare.

2. **Sviluppo rigorosamente step-by-step.** Ogni step va completato, testato manualmente insieme e approvato prima di passare al successivo. Non anticipare mai step futuri.


### Nessun test automatizzato
Non ci sono test (unit, integration o e2e) nel progetto.

---

## 8. Comandi utili

```bash
npm run dev      # dev server su http://localhost:3000
npm run build    # build di produzione
npm run start    # avvia server di produzione
npm run lint     # ESLint check
```
