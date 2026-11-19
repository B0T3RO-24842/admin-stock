import { NextResponse } from "next/server";
import { db } from "@/lib";
import { fail, route } from "@/lib/route";
import { parseProduct } from "@/lib/validate";

type Ctx = { params: Promise<{ id: string }> };

export const PATCH = route(async (_userId, req: Request, { params }: Ctx) => {
  const parsed = parseProduct(await req.json().catch(() => null));
  if (!parsed.ok) return fail(parsed.error, 400);
  const { count } = await db.product.updateMany({ where: { id: (await params).id }, data: parsed.data });
  return count ? NextResponse.json({ ok: true }) : fail("Producto no encontrado.", 404);
});

export const DELETE = route(async (_userId, _req: Request, { params }: Ctx) => {
  const id = (await params).id;
  // Purchases (and their sales) reference the product: deleting it would orphan the history.
  if (await db.purchase.count({ where: { productId: id } })) return fail("El producto tiene compras registradas y no se puede eliminar.", 409);
  const { count } = await db.product.deleteMany({ where: { id } });
  return count ? NextResponse.json({ ok: true }) : fail("Producto no encontrado.", 404);
});
