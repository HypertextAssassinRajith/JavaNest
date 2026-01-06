export function validateCreateOrderBody(body) {
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
