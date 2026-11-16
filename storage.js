const STORAGE_KEY = 'atelier_sucre_orders_v1';

export function getOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveOrder(orderPayload) {
  const existing = getOrders();
  const newOrder = {
    id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: new Date().toISOString(),
    status: 'Confirmed',
    ...orderPayload,
  };
  const updated = [newOrder, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newOrder;
}

export function updateOrderStatus(orderId, status) {
  const existing = getOrders();
  const updated = existing.map((o) => (o.id === orderId ? { ...o, status } : o));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
