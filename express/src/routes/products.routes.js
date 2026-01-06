import { Router } from "express";
import { prisma } from "../db/prisma.js";

const router = Router();

function validateProductBody(body, { partial = false } = {}) {
  if (!body || typeof body !== "object") return "Body is required";

  const { name, price, bgColor, imageUrl, category, discountActive, discountValue } = body;

  if (!partial || name !== undefined) {
    if (!name || typeof name !== "string") return "name is required";
  }

  if (!partial || category !== undefined) {
    if (!category || typeof category !== "string") return "category is required";
  }

  if (price !== undefined && price !== null && typeof price !== "string") return "price must be a string";
  if (bgColor !== undefined && bgColor !== null && typeof bgColor !== "string") return "bgColor must be a string";
  if (imageUrl !== undefined && imageUrl !== null && typeof imageUrl !== "string") return "imageUrl must be a string";
  if (discountActive !== undefined && typeof discountActive !== "boolean") return "discountActive must be a boolean";
  if (discountValue !== undefined && discountValue !== null && typeof discountValue !== "string") return "discountValue must be a string";

  return null;
}

// GET /api/products
router.get("/", async (_req, res) => {
  const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
  res.json(products);
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid id" });

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return res.status(404).json({ message: "Product not found" });

  res.json(product);
});

// POST /api/products
router.post("/", async (req, res) => {
  const err = validateProductBody(req.body, { partial: false });
  if (err) return res.status(400).json({ message: err });

  const { name, price, bgColor, imageUrl, category, discountActive, discountValue } = req.body;

  const product = await prisma.product.create({
    data: {
      name,
      category,
      price: price ?? null,
      bgColor: bgColor ?? null,
      imageUrl: imageUrl ?? null,
      discountActive: discountActive ?? false,
      discountValue: discountValue ?? null,
    },
  });

  res.status(201).json(product);
});

// PATCH /api/products/:id
router.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid id" });

  const err = validateProductBody(req.body, { partial: true });
  if (err) return res.status(400).json({ message: err });

  const { name, price, bgColor, imageUrl, category, discountActive, discountValue } = req.body;

  const product = await prisma.product
    .update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(price !== undefined ? { price: price ?? null } : {}),
        ...(bgColor !== undefined ? { bgColor: bgColor ?? null } : {}),
        ...(imageUrl !== undefined ? { imageUrl: imageUrl ?? null } : {}),
        ...(discountActive !== undefined ? { discountActive } : {}),
        ...(discountValue !== undefined ? { discountValue: discountValue ?? null } : {}),
      },
    })
    .catch(() => null);

  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// DELETE /api/products/:id
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid id" });

  const product = await prisma.product.delete({ where: { id } }).catch(() => null);
  if (!product) return res.status(404).json({ message: "Product not found" });

  res.status(204).send();
});

export default router;
