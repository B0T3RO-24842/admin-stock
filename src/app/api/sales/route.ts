import { NextResponse } from "next/server";
import { db } from "@/lib";
import { fail, route } from "@/lib/route";
import { parseSale } from "@/lib/validate";

export const GET = route(async () => {
  const sales = await db.sale.findMany({ orderBy: { createdAt: "desc" }, include: { purchase: { select: { product: { select: { name: true } } } } } });
  return NextResponse.json(sales.map(({ purchase, ...s }) => ({ ...s, productName: purchase.product.name })));
});

export const POST = route(async (userId, req: Request) => {
  const parsed = parseSale(await req.json().catch(() => null));
  if (!parsed.ok) return fail(parsed.error, 400);
  const { purchaseId, quantity } = parsed.data;

  const sale = await db.$transaction(async (tx) => {
    // The conditional update is atomic: two simultaneous sales cannot take the same last units.
    const { count } = await tx.purchase.updateMany({ where: { id: purchaseId, stock: { gte: quantity } }, data: { stock: { decrement: quantity } } });
    return count ? tx.sale.create({ data: { ...parsed.data, userId } }) : null;
  });
  return sale ? NextResponse.json(sale, { status: 201 }) : fail("Stock insuficiente en ese lote (o el lote no existe).", 409);
});
