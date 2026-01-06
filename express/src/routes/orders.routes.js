import { Router } from "express";
import { prisma } from "../db/prisma.js";
import { validateCreateOrderBody } from "../validators/order.validator.js";

const router = Router();

// POST /api/orders
router.post("/", async (req, res) => {
  const err = validateCreateOrderBody(req.body);
  if (err) return res.status(400).json({ message: err });

  const { items, customer } = req.body;

  const ids = [...new Set(items.map((i) => Number(i.productId)))];
  const products = await prisma.product.findMany({ where: { id: { in: ids } } });
  const byId = new Map(products.map((p) => [p.id, p]));

  let total = 0;
  const normalized = items.map(({ productId, qty }) => {
    const pid = Number(productId);
    const q = Number(qty);
    const product = byId.get(pid);
    if (!product) return { productId: pid, qty: q, _missing: true };

    const unitPrice = Number(product.price ?? 0);
    const lineTotal = unitPrice * q;
    total += lineTotal;

    return {
      productId: pid,
      qty: q,
      name: product.name,
      unitPrice,
      lineTotal,
    };
  });

  const missing = normalized.find((i) => i._missing);
  if (missing) return res.status(400).json({ message: `Unknown productId: ${missing.productId}` });

  const order = await prisma.order.create({
    data: {
      status: "pending",
      totalAmount: total,
      items: {
        customer: { ...customer, note: customer.note ?? "" },
        items: normalized,
      },
    },
  });

  res.status(201).json(order);
});

// GET /api/orders/:id
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid id" });

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return res.status(404).json({ message: "Order not found" });

  res.json(order);
});

// POST /api/orders/:id/pay
router.post("/:id/pay", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid id" });

  const order = await prisma.order
    .update({
      where: { id },
      data: { status: "paid" },
    })
    .catch(() => null);

  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

// PATCH /api/orders/:id/status
router.patch("/:id/status", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid id" });

  const { status } = req.body ?? {};
  if (!status || typeof status !== "string") return res.status(400).json({ message: "status is required" });

  const order = await prisma.order
    .update({
      where: { id },
      data: { status },
    })
    .catch(() => null);

  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

export default router;
