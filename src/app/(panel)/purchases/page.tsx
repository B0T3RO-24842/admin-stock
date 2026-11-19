"use client";

import { useState } from "react";
import { http, useList } from "@/api/http";
import { Skeleton, Field, FormSheet, PageHead, inputClass } from "@/components/shared";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { date, money } from "@/lib/format";

type Product = { id: string; name: string };
type Lot = { id: string; productName: string; quantity: number; stock: number; price: number; createdAt: string };

export default function PurchasesPage() {
  const lots = useList<Lot>("/purchases");
  const products = useList<Product>("/products");
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  async function save() {
    await http("/purchases", "POST", { productId, quantity, price });
    setOpen(false);
    lots.reload();
  }

  if (lots.error) return <p className="p-4 text-red-600">{lots.error}</p>;
  if (!lots.rows) return <Skeleton.List />;

  return (
    <div className="h-full overflow-y-auto p-4">
      <PageHead title="Compras" onNew={() => { setProductId(""); setQuantity(""); setPrice(""); setOpen(true); }} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead className="text-right">Cantidad</TableHead>
            <TableHead className="text-right">Quedan</TableHead>
            <TableHead className="text-right">Costo unitario</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lots.rows.map((l) => (
            <TableRow key={l.id}>
              <TableCell>{date(l.createdAt)}</TableCell>
              <TableCell className="font-medium">{l.productName}</TableCell>
              <TableCell className="text-right">{l.quantity}</TableCell>
              <TableCell className="text-right">{l.stock}</TableCell>
              <TableCell className="text-right">{money(l.price)}</TableCell>
            </TableRow>
          ))}
          {lots.rows.length === 0 && (
            <TableRow><TableCell colSpan={5} className="text-center text-slate-500">Aún no hay compras.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>

      <FormSheet open={open} title="Nueva compra" onClose={() => setOpen(false)} onSubmit={save}>
        <Field label="Producto">
          <select className={inputClass} value={productId} onChange={(e) => setProductId(e.target.value)} required>
            <option value="">Elige uno…</option>
            {products.rows?.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </Field>
        <Field label="Cantidad"><input className={inputClass} type="number" min={1} step={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} required /></Field>
        <Field label="Costo unitario (COP)"><input className={inputClass} type="number" min={0} step="any" value={price} onChange={(e) => setPrice(e.target.value)} required /></Field>
      </FormSheet>
    </div>
  );
}
