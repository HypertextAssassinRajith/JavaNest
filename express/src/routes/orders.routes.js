import { Router } from "express";
import { createOrder, getOrderById, updateOrderStatus } from "../data/orders.js";
import { getProductById } from "../data/products.js";

const router = Router();

function validateCreateOrderBody(body) {
  if (!body || typeof body !== "object") return "Body is required";

  const { items, customer } = body;
  if (!Array.isArray(items) || items.length === 0) return "items must be a non-empty array";

  if (!customer || typeof customer !== "object") return "customer is required";
  const { name, contact, address } = customer;
  if (!name || typeof name !== "string") return "customer.name is required";
  if (!contact || typeof contact !== "string") return "customer.contact is required";
  if (!address || typeof address !== "string") return "customer.address is required";

  for (const it of items) {
    if (!it || typeof it !== "object") return "Each item must be an object";
    const { productId, qty } = it;
    if (!Number.isFinite(Number(productId))) return "item.productId must be a number";
    if (!Number.isFinite(Number(qty)) || Number(qty) <= 0) return "item.qty must be a positive number";
  }

  return null;
}

// POST /api/orders
router.post("/", (req, res) => {
  const err = validateCreateOrderBody(req.body);
  if (err) return res.status(400).json({ message: err });

  const { items, customer } = req.body;


  let total = 0;
  const normalized = items.map(({ productId, qty }) => {
    const pid = Number(productId);
    const q = Number(qty);
    const product = getProductById(pid);
    if (!product) {
      return { productId: pid, qty: q, _missing: true };
    }
    total += Number(product.price) * q;
    return {
      productId: pid,
      qty: q,
      name: product.name,
      unitPrice: Number(product.price),
      lineTotal: Number(product.price) * q,
    };
  });

  const missing = normalized.find((i) => i._missing);
  if (missing) return res.status(400).json({ message: `Unknown productId: ${missing.productId}` });

  const order = createOrder({ items: normalized, customer: { ...customer, note: customer.note ?? "" } });
  order.totalAmount = total;

  res.status(201).json(order);
});

// GET /api/orders/:id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid id" });

  const order = getOrderById(id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  res.json(order);
});

// POST /api/orders/:id/pay
router.post("/:id/pay", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid id" });

  const order = updateOrderStatus(id, "paid");
  if (!order) return res.status(404).json({ message: "Order not found" });

  res.json(order);
});

// PATCH /api/orders/:id/status
router.patch("/:id/status", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid id" });

  const { status } = req.body ?? {};
  if (!status || typeof status !== "string") return res.status(400).json({ message: "status is required" });

  const order = updateOrderStatus(id, status);
  if (!order) return res.status(404).json({ message: "Order not found" });

  res.json(order);
});

export default router;
