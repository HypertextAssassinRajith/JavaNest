import { useCart } from '../store/cart';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const { items, updateQty, remove } = useCart();
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  if (!items.length) {
    return (
      <div>
        <p>Your cart is empty.</p>
        <Link className="text-blue-600 underline" to="/">Go shopping</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Cart</h1>
      <div className="space-y-3">
        {items.map(i => (
          <div key={i.productId} className="flex items-center gap-4 border-b pb-2">
            <div className="flex-1">
              <div className="font-medium">{i.title}</div>
              <div className="text-sm text-gray-600">${i.price.toFixed(2)}</div>
            </div>
            <input
              type="number"
              min="1"
              value={i.qty}
              onChange={e => updateQty(i.productId, parseInt(e.target.value) || 1)}
              className="w-16 border rounded px-2 py-1"
            />
            <button
              onClick={() => remove(i.productId)}
              className="text-red-600 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 font-semibold">Total: ${total.toFixed(2)}</div>
      <Link
        to="/checkout"
        className="inline-block mt-4 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
      >
        Checkout
      </Link>
    </div>
  );
}