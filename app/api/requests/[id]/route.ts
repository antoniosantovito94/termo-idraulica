import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!UUID_REGEX.test(id)) {
    return NextResponse.json({ error: "ID non valido." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("appointment_requests")
    .select(
      `
      id,
      first_name,
      last_name,
      email,
      phone,
      description,
      status,
      created_at,
      appointment_request_photos (
        id,
        storage_path,
        original_name,
        created_at
      )
    `
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Richiesta non trovata." },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}
