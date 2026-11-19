import { NextResponse } from "next/server";
import { db } from "@/lib";
import { fail, route } from "@/lib/route";
import { parsePurchase } from "@/lib/validate";

export const GET = route(async () => {
  const lots = await db.purchase.findMany({ orderBy: { createdAt: "desc" }, include: { product: { select: { name: true } } } });
  return NextResponse.json(lots.map(({ product, ...l }) => ({ ...l, productName: product.name })));
});

export const POST = route(async (_userId, req: Request) => {
  const parsed = parsePurchase(await req.json().catch(() => null));
  if (!parsed.ok) return fail(parsed.error, 400);
  if (!(await db.product.count({ where: { id: parsed.data.productId } }))) return fail("Producto no encontrado.", 404);
  // A new lot starts with all its units in stock.
  return NextResponse.json(await db.purchase.create({ data: { ...parsed.data, stock: parsed.data.quantity } }), { status: 201 });
});
