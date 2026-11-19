"use client";

import { useState } from "react";
import { http, useList } from "@/api/http";
import { Skeleton, Field, FormSheet, PageHead, inputClass } from "@/components/shared";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { date, money } from "@/lib/format";

type Lot = { id: string; productName: string; stock: number; createdAt: string };
type Sale = { id: string; productName: string; quantity: number; price: number; note: string | null; createdAt: string };

export default function SalesPage() {
  const sales = useList<Sale>("/sales");
  const lots = useList<Lot>("/purchases");
  const [open, setOpen] = useState(false);
  const [purchaseId, setPurchaseId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");

  async function save() {
    await http("/sales", "POST", { purchaseId, quantity, price, note });
    setOpen(false);
    sales.reload();
    lots.reload(); // stock changed: the lot list in the form must reflect it
  }

  if (sales.error) return <p className="p-4 text-red-600">{sales.error}</p>;
  if (!sales.rows) return <Skeleton.List />;

  const available = lots.rows?.filter((l) => l.stock > 0) ?? [];
  const max = available.find((l) => l.id === purchaseId)?.stock;

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <PageHead title="Ventas" onNew={() => { setPurchaseId(""); setQuantity(""); setPrice(""); setNote(""); setOpen(true); }} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead className="text-right">Cantidad</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Nota</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.rows.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{date(s.createdAt)}</TableCell>
              <TableCell className="font-medium">{s.productName}</TableCell>
              <TableCell className="text-right">{s.quantity}</TableCell>
              <TableCell className="text-right">{money(s.price)}</TableCell>
              <TableCell className="text-right">{money(s.quantity * s.price)}</TableCell>
              <TableCell>{s.note}</TableCell>
            </TableRow>
          ))}
          {sales.rows.length === 0 && (
            <TableRow><TableCell colSpan={6} className="text-center text-slate-500">Aún no hay ventas.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>

      <FormSheet open={open} title="Nueva venta" onClose={() => setOpen(false)} onSubmit={save}>
        <Field label="Lote">
          <select className={inputClass} value={purchaseId} onChange={(e) => setPurchaseId(e.target.value)} required>
            <option value="">Elige uno…</option>
            {available.map((l) => <option key={l.id} value={l.id}>{l.productName} · compra del {date(l.createdAt)} · quedan {l.stock}</option>)}
          </select>
        </Field>
        <Field label="Cantidad"><input className={inputClass} type="number" min={1} max={max} step={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} required /></Field>
        <Field label="Precio de venta unitario (COP)"><input className={inputClass} type="number" min={0} step="any" value={price} onChange={(e) => setPrice(e.target.value)} required /></Field>
        <Field label="Nota"><input className={inputClass} value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} /></Field>
      </FormSheet>
    </div>
  );
}
