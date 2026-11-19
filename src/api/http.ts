"use client";

import { useCallback, useEffect, useState } from "react";

export async function http<T = unknown>(url: string, method = "GET", body?: unknown): Promise<T> {
  const res = await fetch(`/api${url}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error ?? "Error del servidor.");
  return data as T;
}

export function useList<T>(url: string) {
  const [rows, setRows] = useState<T[] | undefined>();
  const [error, setError] = useState("");
  const reload = useCallback(() => {
    http<T[]>(url).then(setRows).catch((e: Error) => setError(e.message));
  }, [url]);
  useEffect(reload, [reload]);
  return { rows, error, reload };
}
