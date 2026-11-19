import { db } from "@/lib";
import { money } from "@/lib/format";

export const dynamic = "force-dynamic";

const LOW_STOCK = 5;

export default async function DashboardPage() {
  const [products, lots, sales] = await Promise.all([
    db.product.findMany({ include: { productPurchase: { select: { stock: true } } }, orderBy: { name: "asc" } }),
    db.purchase.findMany({ select: { stock: true, price: true } }),
    db.sale.findMany({ select: { quantity: true, price: true, purchase: { select: { price: true } } } }),
  ]);

  const inventoryValue = lots.reduce((s, l) => s + l.stock * l.price, 0);
  const revenue = sales.reduce((s, v) => s + v.quantity * v.price, 0);
  const profit = sales.reduce((s, v) => s + v.quantity * (v.price - v.purchase.price), 0);
  const low = products
    .map((p) => ({ name: p.name, stock: p.productPurchase.reduce((s, l) => s + l.stock, 0) }))
    .filter((p) => p.stock <= LOW_STOCK);

  const cards = [
    ["Productos", String(products.length)],
    ["Valor del inventario", money(inventoryValue)],
    ["Ventas", money(revenue)],
    ["Ganancia", money(profit)],
  ];

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <h1 className="pb-4 text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="pt-1 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <h2 className="pt-8 pb-2 text-lg font-semibold">Stock bajo (≤ {LOW_STOCK} unidades)</h2>
      {low.length === 0 ? (
        <p className="text-sm text-slate-500">Todo el inventario está por encima del mínimo.</p>
      ) : (
        <ul className="grid gap-2 text-sm">
          {low.map((p) => (
            <li key={p.name} className="flex justify-between rounded-lg border border-slate-200 px-3 py-2">
              <span>{p.name}</span>
              <strong className={p.stock === 0 ? "text-red-600" : "text-amber-600"}>{p.stock === 0 ? "Agotado" : `${p.stock} und.`}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
