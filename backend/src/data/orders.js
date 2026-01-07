let nextOrderId = 1;

export const orders = [];

export function createOrder({ items, customer }) {
  const order = {
    id: nextOrderId++,
    status: "pending",
    createdAt: new Date().toISOString(),
    customer,
    items,
    totalAmount: 0,
  };

  orders.push(order);
  return order;
}

export function getOrderById(id) {
  return orders.find((o) => o.id === id);
}

export function updateOrderStatus(id, status) {
  const order = getOrderById(id);
  if (!order) return null;
  order.status = status;
  return order;
}
