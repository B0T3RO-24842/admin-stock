import assert from "node:assert/strict";
import { test } from "node:test";
import { parseProduct, parsePurchase, parseSale } from "./validate.ts";

test("product: trims, requires a name, empty note becomes null", () => {
  assert.deepEqual(parseProduct({ name: "  Tornillo ", note: " " }), { ok: true, data: { name: "Tornillo", note: null } });
  assert.equal(parseProduct({ name: "  " }).ok, false);
  assert.equal(parseProduct(null).ok, false);
  assert.equal(parseProduct({ name: "x".repeat(81) }).ok, false);
});

test("purchase: positive integer quantity, non-negative price, accepts numeric strings", () => {
  assert.deepEqual(parsePurchase({ productId: "p", quantity: "5", price: "1200.5" }), { ok: true, data: { productId: "p", quantity: 5, price: 1200.5 } });
  for (const quantity of [0, -1, 1.5, "", "abc", null]) assert.equal(parsePurchase({ productId: "p", quantity, price: 1 }).ok, false, String(quantity));
  assert.equal(parsePurchase({ productId: "p", quantity: 1, price: -1 }).ok, false);
  assert.equal(parsePurchase({ quantity: 1, price: 1 }).ok, false);
});

test("sale: needs a lot, quantity and price", () => {
  assert.equal(parseSale({ purchaseId: "l", quantity: 2, price: 10 }).ok, true);
  assert.equal(parseSale({ quantity: 2, price: 10 }).ok, false);
  assert.equal(parseSale({ purchaseId: "l", quantity: 0, price: 10 }).ok, false);
  assert.equal(parseSale({ purchaseId: "l", quantity: 1, price: Infinity }).ok, false);
});
