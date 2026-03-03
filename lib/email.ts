import nodemailer from "nodemailer";

const GMAIL_USER = process.env.GMAIL_USER ?? "";
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD ?? "";

// App URL used to reference the logo image in emails.
// In production: set APP_URL=https://tuodominio.it in .env
// In development: logo won't render in email clients (localhost not accessible)
const APP_URL = (process.env.APP_URL ?? "").replace(/\/$/, "");

export interface SendConfirmationEmailParams {
  to: string;
  firstName: string;
  lastName: string;
  requestId: string;
}

export async function sendConfirmationEmail(
  params: SendConfirmationEmailParams
): Promise<void> {
  const { to, firstName, lastName, requestId } = params;

  const logoUrl = APP_URL ? `${APP_URL}/logo.webp` : "";

  const html = `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Richiesta ricevuta — Termoidraulica Lotito</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f1f5f9;
      margin: 0;
      padding: 0;
    }
    .outer {
      padding: 40px 16px;
    }
    .wrapper {
      max-width: 560px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    }
    /* ── Header brand ── */
    .header {
      background: #ffffff;
      padding: 28px 40px 20px;
      text-align: center;
      border-bottom: 1px solid #e2e8f0;
    }
    .header img {
      max-height: 70px;
      max-width: 200px;
      object-fit: contain;
    }
    .header .company-name {
      margin: 10px 0 0;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #64748b;
    }
    /* ── Status banner ── */
    .banner {
      background: #1e40af;
      padding: 24px 40px;
      text-align: center;
    }
    .banner h1 {
      color: #ffffff;
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.2px;
    }
    .banner .check {
      display: inline-block;
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      line-height: 40px;
      font-size: 20px;
      margin-bottom: 10px;
    }
    /* ── Body ── */
    .body {
      padding: 36px 40px;
    }
    .body p {
      color: #374151;
      line-height: 1.75;
      margin: 0 0 16px;
      font-size: 15px;
    }
    .body strong {
      color: #111827;
    }
    .highlight {
      background: #eff6ff;
      border-left: 4px solid #1e40af;
      border-radius: 0 8px 8px 0;
      padding: 14px 18px;
      margin: 20px 0;
    }
    .highlight p {
      margin: 0;
      color: #1e40af;
      font-weight: 600;
      font-size: 15px;
    }
    .ref {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 16px 20px;
      font-size: 13px;
      color: #64748b;
      margin-top: 28px;
    }
    .ref .label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #94a3b8;
      margin-bottom: 4px;
    }
    .ref .value {
      font-family: 'Courier New', Courier, monospace;
      font-size: 14px;
      font-weight: 700;
      color: #1e293b;
      word-break: break-all;
    }
    /* ── Divider ── */
    .divider {
      height: 1px;
      background: #f1f5f9;
      margin: 28px 0;
    }
    /* ── Contact block ── */
    .contact {
      background: #f8fafc;
      border-radius: 10px;
      padding: 16px 20px;
      font-size: 14px;
      color: #475569;
    }
    .contact strong {
      display: block;
      color: #1e293b;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    /* ── Footer ── */
    .footer {
      background: #f8fafc;
      padding: 18px 40px;
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      line-height: 1.6;
    }
    .footer .brand {
      font-weight: 600;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="outer">
    <div class="wrapper">

      <!-- Brand header -->
      <div class="header">
        ${logoUrl ? `<img src="${logoUrl}" alt="Termoidraulica Lotito" />` : ""}
        <p class="company-name">Termoidraulica Lotito</p>
      </div>

      <!-- Status banner -->
      <div class="banner">
        <div class="check">&#10003;</div>
        <h1>Richiesta ricevuta</h1>
      </div>

      <!-- Body -->
      <div class="body">
        <p>Gentile <strong>${firstName} ${lastName}</strong>,</p>

        <div class="highlight">
          <p>Abbiamo ricevuto la tua richiesta di appuntamento.</p>
        </div>

        <p>
          Il nostro team ti contatterà il prima possibile per confermare
          i dettagli e fissare un appuntamento comodo per te.
        </p>

        <div class="divider"></div>

        <div class="contact">
          <strong>Hai bisogno di assistenza urgente?</strong>
          Contattaci direttamente rispondendo a questa email oppure
          chiamaci: ti aiuteremo subito.
        </div>

        <!-- Reference ID -->
        <div class="ref">
          <div class="label">Numero di riferimento</div>
          <div class="value">${requestId}</div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <span class="brand">Termoidraulica Lotito</span><br />
        Questa è un&apos;email automatica — per favore non rispondere direttamente.
      </div>

    </div>
  </div>
</body>
</html>
  `.trim();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: GMAIL_USER,
      to,
      subject: "Richiesta ricevuta — ti contatteremo presto",
      html,
    });
  } catch (error) {
    // Log but never throw: a mail failure must not surface as a user error.
    // The appointment request is already saved in the database.
    console.error("[email] Failed to send confirmation email:", error);
  }
}
