import { NextResponse } from "next/server";
import { db } from "@/lib";
import { fail, route } from "@/lib/route";
import { parseProduct } from "@/lib/validate";

export const GET = route(async () => {
  const products = await db.product.findMany({
    orderBy: { name: "asc" },
    include: { productPurchase: { select: { stock: true } } },
  });
  return NextResponse.json(
    products.map(({ productPurchase, ...p }) => ({ ...p, stock: productPurchase.reduce((s, l) => s + l.stock, 0) })),
  );
});

export const POST = route(async (_userId, req: Request) => {
  const parsed = parseProduct(await req.json().catch(() => null));
  if (!parsed.ok) return fail(parsed.error, 400);
  return NextResponse.json(await db.product.create({ data: parsed.data }), { status: 201 });
});
