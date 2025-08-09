import { useCart } from '../store/cart';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const { items, updateQty, remove } = useCart();
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  if (!items.length) {
    return (
      <div className="pt-10 flex flex-col items-center gap-4">
        <div className="text-xl font-semibold">Your cart is empty</div>
        <Link className="btn btn-primary" to="/">Go shopping</Link>
      </div>
    );
  }

  return (
    <div className="pt-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Cart</h1>
      <div className="space-y-4">
        {items.map(i => (
          <div key={i.productId} className="card card-side bg-base-100 shadow-sm border">
            <div className="card-body py-4 px-6 flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <h2 className="card-title text-lg">{i.title}</h2>
                <p className="text-sm opacity-70">${i.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  value={i.qty}
                  onChange={e => updateQty(i.productId, parseInt(e.target.value) || 1)}
                  className="input input-bordered w-20"
                />
                <button
                  onClick={() => remove(i.productId)}
                  className="btn btn-ghost text-error btn-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="text-xl font-semibold">
          Total: <span className="text-primary">${total.toFixed(2)}</span>
        </div>
        <Link
          to="/checkout"
          className="btn btn-success"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}