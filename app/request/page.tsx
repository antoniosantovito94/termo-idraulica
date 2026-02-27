"use client";

import { useState, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { clientSchema, type ClientFormValues } from "@/lib/validators";

// ── Types ─────────────────────────────────────────────────────────────────────

interface PhotoPreview {
  file: File;
  previewUrl: string;
  id: string; // locally unique key (crypto.randomUUID)
}

type SubmitState = "idle" | "loading" | "success" | "error";

// ── Helpers ───────────────────────────────────────────────────────────────────

const MAX_PHOTOS = 10;
const MAX_FILE_SIZE_MB = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// ── Page Component ────────────────────────────────────────────────────────────

export default function RequestPage() {
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      description: "",
    },
  });

  // ── Photo handling ──────────────────────────────────────────────────────────

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPhotoError(null);
      const selected = Array.from(e.target.files ?? []);

      const invalid = selected.find((f) => !ALLOWED_TYPES.includes(f.type));
      if (invalid) {
        setPhotoError(
          `"${invalid.name}" non è un formato supportato (JPEG, PNG, WEBP, GIF).`
        );
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      const tooBig = selected.find(
        (f) => f.size > MAX_FILE_SIZE_MB * 1024 * 1024
      );
      if (tooBig) {
        setPhotoError(
          `"${tooBig.name}" supera il limite di ${MAX_FILE_SIZE_MB}MB.`
        );
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      const available = MAX_PHOTOS - photos.length;
      const accepted = selected.slice(0, available);

      if (selected.length > available) {
        setPhotoError(
          `Puoi allegare al massimo ${MAX_PHOTOS} foto. Sono state aggiunte solo le prime ${available}.`
        );
      }

      const newPreviews: PhotoPreview[] = accepted.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        id: crypto.randomUUID(),
      }));

      setPhotos((prev) => [...prev, ...newPreviews]);

      // Reset input so same file can be re-added after removal
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [photos.length]
  );

  const removePhoto = useCallback((id: string) => {
    setPhotoError(null);
    setPhotos((prev) => {
      const removed = prev.find((p) => p.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  // ── Form submit ─────────────────────────────────────────────────────────────

  const onSubmit = async (values: ClientFormValues) => {
    setServerError(null);
    setSubmitState("loading");

    const fd = new FormData();
    fd.append("firstName", values.firstName);
    fd.append("lastName", values.lastName);
    fd.append("email", values.email);
    fd.append("phone", values.phone);
    fd.append("description", values.description);
    fd.append("honeypot", ""); // always empty for real users

    photos.forEach(({ file }) => fd.append("photos", file));

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        body: fd,
        // Do NOT set Content-Type header — the browser sets it with the boundary
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? `Errore ${res.status}`);
      }

      // Clean up object URLs to free memory
      photos.forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl));
      setPhotos([]);
      reset();
      setSubmitState("success");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Si è verificato un errore. Riprova.";
      setServerError(message);
      setSubmitState("error");
    }
  };

  const isLoading = isSubmitting || submitState === "loading";

  // ── Success Screen ──────────────────────────────────────────────────────────

  if (submitState === "success") {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 text-center">
          {/* Success icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Richiesta inviata!
          </h2>
          <p className="text-gray-600 mb-2">
            Abbiamo ricevuto la tua richiesta di appuntamento.
          </p>
          <p className="text-gray-600 mb-6">
            <strong>Ti contatteremo il prima possibile</strong> per confermare i
            dettagli.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Riceverai una email di conferma a breve.
          </p>

          <button
            onClick={() => {
              setSubmitState("idle");
              setServerError(null);
            }}
            className="btn-primary w-full"
          >
            Invia un&apos;altra richiesta
          </button>
        </div>
      </main>
    );
  }

  // ── Main Form ───────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-2xl">
        {/* ── Header ── */}
        <div className="mb-8 text-center">
          <Image
            src="/logo.webp"
            alt="Logo aziendale"
            width={140}
            height={70}
            className="mx-auto mb-6 object-contain"
            priority
          />
          <h1 className="text-3xl font-bold text-gray-900">
            Richiesta Appuntamento
          </h1>
          <p className="mt-2 text-gray-600">
            Compila il modulo e ti ricontatteremo al più presto.
          </p>
        </div>

        {/* ── Form card ── */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          {/* Global server error */}
          {submitState === "error" && serverError && (
            <div
              role="alert"
              className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 flex gap-3"
            >
              <svg
                className="h-5 w-5 text-red-500 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* ── Honeypot (hidden from users, visible to bots) ── */}
            <div
              className="hidden"
              aria-hidden="true"
              style={{ display: "none" }}
            >
              <label htmlFor="hp_field">Non compilare questo campo</label>
              <input
                id="hp_field"
                name="honeypot"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* ── Nome + Cognome ── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
              {/* Nome */}
              <div>
                <label htmlFor="firstName" className="form-label">
                  Nome <span className="text-red-500" aria-label="obbligatorio">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Mario"
                  className={`form-input ${errors.firstName ? "form-input-error" : ""}`}
                  aria-invalid={!!errors.firstName}
                  aria-describedby={
                    errors.firstName ? "firstName-error" : undefined
                  }
                  disabled={isLoading}
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p id="firstName-error" className="form-error" role="alert">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Cognome */}
              <div>
                <label htmlFor="lastName" className="form-label">
                  Cognome <span className="text-red-500" aria-label="obbligatorio">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Rossi"
                  className={`form-input ${errors.lastName ? "form-input-error" : ""}`}
                  aria-invalid={!!errors.lastName}
                  aria-describedby={
                    errors.lastName ? "lastName-error" : undefined
                  }
                  disabled={isLoading}
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p id="lastName-error" className="form-error" role="alert">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* ── Email ── */}
            <div className="mb-4">
              <label htmlFor="email" className="form-label">
                Email <span className="text-red-500" aria-label="obbligatorio">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="mario.rossi@example.com"
                className={`form-input ${errors.email ? "form-input-error" : ""}`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                disabled={isLoading}
                {...register("email")}
              />
              {errors.email && (
                <p id="email-error" className="form-error" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* ── Telefono ── */}
            <div className="mb-4">
              <label htmlFor="phone" className="form-label">
                Telefono <span className="text-red-500" aria-label="obbligatorio">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+39 333 1234567"
                className={`form-input ${errors.phone ? "form-input-error" : ""}`}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                disabled={isLoading}
                {...register("phone")}
              />
              {errors.phone && (
                <p id="phone-error" className="form-error" role="alert">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* ── Descrizione ── */}
            <div className="mb-6">
              <label htmlFor="description" className="form-label">
                Descrizione del problema{" "}
                <span className="text-red-500" aria-label="obbligatorio">*</span>
              </label>
              <textarea
                id="description"
                rows={5}
                placeholder="Descrivi il problema o l'intervento richiesto..."
                className={`form-input resize-y min-h-[120px] ${errors.description ? "form-input-error" : ""}`}
                aria-invalid={!!errors.description}
                aria-describedby={
                  errors.description ? "description-error" : undefined
                }
                disabled={isLoading}
                {...register("description")}
              />
              {errors.description && (
                <p
                  id="description-error"
                  className="form-error"
                  role="alert"
                >
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* ── Foto ── */}
            <div className="mb-8">
              <label className="form-label">
                Foto{" "}
                <span className="text-gray-400 font-normal">(opzionale)</span>
              </label>
              <p className="form-hint mb-3">
                Puoi allegare fino a {MAX_PHOTOS} foto (JPEG, PNG, WEBP, GIF —
                max {MAX_FILE_SIZE_MB}MB ciascuna).
              </p>

              {/* Upload zone */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer
                  hover:border-blue-400 hover:bg-blue-50/50 transition-colors duration-150"
                onClick={() => !isLoading && fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    !isLoading && fileInputRef.current?.click();
                  }
                }}
                role="button"
                tabIndex={isLoading ? -1 : 0}
                aria-label="Clicca per selezionare le foto"
              >
                <svg
                  className="mx-auto h-10 w-10 text-gray-400 mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600">
                    Clicca per selezionare
                  </span>{" "}
                  o trascina le foto qui
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {photos.length}/{MAX_PHOTOS} foto selezionate
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                className="sr-only"
                aria-hidden="true"
                tabIndex={-1}
                disabled={isLoading || photos.length >= MAX_PHOTOS}
                onChange={handleFileChange}
              />

              {/* Photo error */}
              {photoError && (
                <p className="form-error mt-2" role="alert">
                  {photoError}
                </p>
              )}

              {/* Photo preview grid */}
              {photos.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {photos.map(({ id, previewUrl, file }) => (
                    <div key={id} className="relative group rounded-lg overflow-hidden bg-gray-100 aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Overlay with filename */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs truncate">{file.name}</p>
                      </div>
                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => removePhoto(id)}
                        disabled={isLoading}
                        className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label={`Rimuovi ${file.name}`}
                      >
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full text-base py-3.5"
            >
              {isLoading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Invio in corso...
                </>
              ) : (
                "Invia richiesta"
              )}
            </button>

            <p className="mt-3 text-center text-xs text-gray-500">
              I campi contrassegnati con{" "}
              <span className="text-red-500">*</span> sono obbligatori.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
