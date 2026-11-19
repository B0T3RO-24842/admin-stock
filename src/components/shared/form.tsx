"use client";

import { FormEvent, ReactNode, useState } from "react";
import { Button, Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui";

export const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}

export function PageHead({ title, onNew }: { title: string; onNew?: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 pb-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {onNew && <Button onClick={onNew}>Nuevo</Button>}
    </div>
  );
}

// Side sheet with a form: shows the server's error message and blocks double submits.
export function FormSheet({ open, title, onClose, onSubmit, children }: {
  open: boolean; title: string; onClose: () => void; onSubmit: () => Promise<void>; children: ReactNode;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onSubmit();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="bg-white">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          {children}
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={busy}>{busy ? "Guardando…" : "Guardar"}</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
