export function validateProductBody(body, { partial = false } = {}) {
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
