import { Router } from "express";
import { products, getProductById } from "../data/products.js";

const router = Router();

// GET /api/products
router.get("/", (_req, res) => {
  res.json(products);
});

// GET /api/products/:id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid id" });

  const product = getProductById(id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  res.json(product);
});

export default router;
