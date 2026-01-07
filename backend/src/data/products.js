export const products = [
  {
    id: 1,
    name: "Espresso",
    price: 320.0,
    bgColor: "#3b2a1f",
    imageUrl: "/images/espresso.png",
    description: "Rich, bold espresso shot.",
    available: true,
  },
  {
    id: 2,
    name: "Cappuccino",
    price: 450.0,
    bgColor: "#4b2f1a",
    imageUrl: "/images/cappuccino.png",
    description: "Espresso with steamed milk and foam.",
    available: true,
  },
  {
    id: 3,
    name: "Iced Latte",
    price: 520.0,
    bgColor: "#2d1d14",
    imageUrl: "/images/iced-latte.png",
    description: "Chilled latte over ice.",
    available: true,
  },
];

export function getProductById(id) {
  return products.find((p) => p.id === id);
}
