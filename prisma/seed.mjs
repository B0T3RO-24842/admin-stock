// Demo data. Run with `npm run seed`; it refuses to touch a database that already has products.
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

if (await db.product.count()) {
  console.log("La base ya tiene productos: no se siembra nada.");
} else {
  const items = [
    ["Camiseta básica", "Algodón, talla M", 40, 18000, 12],
    ["Gorra negra", "Ajustable", 25, 15000, 3],
    ["Termo 750 ml", "Acero inoxidable", 30, 32000, 30],
    ["Morral urbano", null, 15, 55000, 0],
  ];
  for (const [name, note, quantity, price, sold] of items) {
    const product = await db.product.create({ data: { name, note } });
    const lot = await db.purchase.create({ data: { productId: product.id, quantity, stock: quantity - sold, price } });
    if (sold) await db.sale.create({ data: { purchaseId: lot.id, quantity: sold, price: Math.round(price * 1.6), userId: "seed" } });
  }
  console.log("Datos de ejemplo creados.");
}
await db.$disconnect();
