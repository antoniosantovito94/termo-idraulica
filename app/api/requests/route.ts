import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { supabaseAdmin } from "@/lib/supabase";
import { sendConfirmationEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rateLimit";
import { parseAndValidateFormData } from "@/lib/validators";

// Required for Buffer and file uploads (not compatible with edge runtime)
export const runtime = "nodejs";

const BUCKET = "appointment-photos";
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_PHOTOS = 10;

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  // ── 1. Rate limiting ───────────────────────────────────────────────────────
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Troppe richieste. Riprova tra un'ora." },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
          ),
        },
      }
    );
  }

  // ── 2. Parse multipart/form-data ───────────────────────────────────────────
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Formato della richiesta non valido. Usa multipart/form-data." },
      { status: 400 }
    );
  }

  // ── 3. Extract and validate text fields ────────────────────────────────────
  const fields: Record<string, string> = {
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    description: String(formData.get("description") ?? ""),
    honeypot: String(formData.get("honeypot") ?? ""),
  };

  const validation = parseAndValidateFormData(fields);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 422 });
  }

  const { firstName, lastName, email, phone, description } = validation.data;

  // ── 4. Validate uploaded files ─────────────────────────────────────────────
  const rawFiles = formData.getAll("photos") as File[];
  // Filter out empty file inputs (browser sends empty File when no file selected)
  const files = rawFiles.filter((f) => f instanceof File && f.size > 0);

  if (files.length > MAX_PHOTOS) {
    return NextResponse.json(
      { error: `Puoi allegare al massimo ${MAX_PHOTOS} foto.` },
      { status: 422 }
    );
  }

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          error: `Il file "${file.name}" supera i ${MAX_FILE_SIZE_MB}MB consentiti.`,
        },
        { status: 422 }
      );
    }
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Il file "${file.name}" non è un formato supportato (JPEG, PNG, WEBP, GIF).`,
        },
        { status: 422 }
      );
    }
  }

  // ── 5. Insert appointment request into DB ──────────────────────────────────
  const { data: requestRow, error: insertError } = await supabaseAdmin
    .from("appointment_requests")
    .insert({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      description,
      status: "presa_in_carico",
    })
    .select("id, status")
    .single();

  if (insertError || !requestRow) {
    console.error("[api/requests POST] DB insert error:", insertError);
    return NextResponse.json(
      { error: "Errore interno del server. Riprova più tardi." },
      { status: 500 }
    );
  }

  const requestId: string = requestRow.id;

  // ── 6. Upload photos to Supabase Storage ───────────────────────────────────
  const photoRecords: {
    request_id: string;
    storage_path: string;
    original_name: string;
  }[] = [];

  for (const file of files) {
    const ext = (file.name.split(".").pop() ?? "bin").toLowerCase();
    const baseName = file.name
      .replace(/\.[^.]+$/, "") // remove extension
      .replace(/[^a-zA-Z0-9_-]/g, "_") // sanitize path components
      .substring(0, 80);
    const storagePath = `${requestId}/${baseName}-${uuidv4()}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("[api/requests POST] Storage upload error:", uploadError);
      // Non-fatal: log and continue with remaining files
      continue;
    }

    photoRecords.push({
      request_id: requestId,
      storage_path: storagePath,
      original_name: file.name,
    });
  }

  // ── 7. Insert photo metadata records ──────────────────────────────────────
  if (photoRecords.length > 0) {
    const { error: photoInsertError } = await supabaseAdmin
      .from("appointment_request_photos")
      .insert(photoRecords);

    if (photoInsertError) {
      console.error(
        "[api/requests POST] Photo records insert error:",
        photoInsertError
      );
      // Non-fatal: main request is already saved
    }
  }

  // ── 8. Send confirmation email (non-blocking failure) ─────────────────────
  await sendConfirmationEmail({
    to: email,
    firstName,
    lastName,
    requestId,
  });

  // ── 9. Return success ──────────────────────────────────────────────────────
  return NextResponse.json(
    { id: requestId, status: requestRow.status },
    { status: 201 }
  );
}
