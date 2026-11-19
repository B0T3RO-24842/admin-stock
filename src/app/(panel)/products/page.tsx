"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { http, useList } from "@/api/http";
import { Skeleton, Field, FormSheet, PageHead, inputClass } from "@/components/shared";
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";

type Product = { id: string; name: string; note: string | null; stock: number };

export default function ProductsPage() {
  const { rows, error, reload } = useList<Product>("/products");
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [problem, setProblem] = useState("");

  function open(p: Product | "new") {
    setEditing(p);
    setName(p === "new" ? "" : p.name);
    setNote(p === "new" ? "" : (p.note ?? ""));
  }

  async function save() {
    if (!editing) return;
    await http(editing === "new" ? "/products" : `/products/${editing.id}`, editing === "new" ? "POST" : "PATCH", { name, note });
    setEditing(null);
    reload();
  }

  async function remove(p: Product) {
    if (!confirm(`¿Eliminar "${p.name}"?`)) return;
    setProblem("");
    try {
      await http(`/products/${p.id}`, "DELETE");
      reload();
    } catch (e) {
      setProblem((e as Error).message);
    }
  }

  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!rows) return <Skeleton.List />;

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <PageHead title="Productos" onNew={() => open("new")} />
      {problem && <p role="alert" className="pb-3 text-sm text-red-600">{problem}</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Nota</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell>{p.note}</TableCell>
              <TableCell className="text-right">{p.stock}</TableCell>
              <TableCell className="flex justify-end gap-1">
                <Button variant="outline" size="icon" aria-label={`Editar ${p.name}`} onClick={() => open(p)}><Pencil /></Button>
                <Button variant="outline" size="icon" aria-label={`Eliminar ${p.name}`} onClick={() => remove(p)}><Trash2 /></Button>
              </TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow><TableCell colSpan={4} className="text-center text-slate-500">Aún no hay productos.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>

      <FormSheet open={editing !== null} title={editing === "new" ? "Nuevo producto" : "Editar producto"} onClose={() => setEditing(null)} onSubmit={save}
        hint="El stock no se escribe aquí: sube con cada compra y baja con cada venta, para que el inventario siempre cuadre con el historial.">

        <Field label="Nombre"><input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} maxLength={80} required autoFocus /></Field>
        <Field label="Nota"><textarea className={inputClass} value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} rows={3} /></Field>
      </FormSheet>
    </div>
  );
}
