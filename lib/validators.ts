import { z } from "zod";

export const appointmentRequestSchema = z.object({
  firstName: z
    .string()
    .min(2, "Il nome deve avere almeno 2 caratteri")
    .max(100, "Il nome è troppo lungo"),
  lastName: z
    .string()
    .min(2, "Il cognome deve avere almeno 2 caratteri")
    .max(100, "Il cognome è troppo lungo"),
  email: z.string().email("Inserisci un indirizzo email valido"),
  phone: z
    .string()
    .min(6, "Il numero di telefono non è valido")
    .max(20, "Il numero di telefono è troppo lungo")
    .regex(/^[+\d\s\-().]+$/, "Il numero di telefono contiene caratteri non validi"),
  description: z
    .string()
    .min(10, "La descrizione deve avere almeno 10 caratteri")
    .max(2000, "La descrizione è troppo lunga (max 2000 caratteri)"),
  honeypot: z.string().max(0, "Bot detected").optional(),
});

export type AppointmentRequestInput = z.infer<typeof appointmentRequestSchema>;

/**
 * Server-side helper: parse + validate fields from FormData.
 * Returns first validation error as a human-readable string.
 */
export function parseAndValidateFormData(
  data: Record<string, string>
):
  | { success: true; data: AppointmentRequestInput }
  | { success: false; error: string } {
  const result = appointmentRequestSchema.safeParse(data);
  if (!result.success) {
    const firstError = result.error.issues[0];
    return { success: false, error: firstError?.message ?? "Dati non validi" };
  }
  if (result.data.honeypot && result.data.honeypot.length > 0) {
    return { success: false, error: "Bot detected" };
  }
  return { success: true, data: result.data };
}

// Client-side schema (same rules, no honeypot — handled separately)
export const clientSchema = appointmentRequestSchema.omit({ honeypot: true });
export type ClientFormValues = z.infer<typeof clientSchema>;
