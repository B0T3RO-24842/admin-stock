export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

const obj = (b: unknown): Record<string, unknown> => (b && typeof b === "object" ? (b as Record<string, unknown>) : {});
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const num = (v: unknown) => (typeof v === "number" || (typeof v === "string" && v.trim() !== "") ? Number(v) : NaN);
const bad = (error: string): { ok: false; error: string } => ({ ok: false, error });

export function parseProduct(body: unknown): Result<{ name: string; note: string | null }> {
  const b = obj(body);
  const name = str(b.name);
  const note = str(b.note);
  if (!name) return bad("El nombre es obligatorio.");
  if (name.length > 80) return bad("El nombre admite hasta 80 caracteres.");
  if (note.length > 300) return bad("La nota admite hasta 300 caracteres.");
  return { ok: true, data: { name, note: note || null } };
}

export function parsePurchase(body: unknown): Result<{ productId: string; quantity: number; price: number }> {
  const b = obj(body);
  const productId = str(b.productId);
  const quantity = num(b.quantity);
  const price = num(b.price);
  if (!productId) return bad("Elige un producto.");
  if (!Number.isInteger(quantity) || quantity < 1) return bad("La cantidad debe ser un entero mayor que 0.");
  if (!Number.isFinite(price) || price < 0) return bad("El precio no puede ser negativo.");
  return { ok: true, data: { productId, quantity, price } };
}

export function parseSale(body: unknown): Result<{ purchaseId: string; quantity: number; price: number; note: string | null }> {
  const b = obj(body);
  const purchaseId = str(b.purchaseId);
  const quantity = num(b.quantity);
  const price = num(b.price);
  const note = str(b.note);
  if (!purchaseId) return bad("Elige un lote.");
  if (!Number.isInteger(quantity) || quantity < 1) return bad("La cantidad debe ser un entero mayor que 0.");
  if (!Number.isFinite(price) || price < 0) return bad("El precio no puede ser negativo.");
  if (note.length > 300) return bad("La nota admite hasta 300 caracteres.");
  return { ok: true, data: { purchaseId, quantity, price, note: note || null } };
}
