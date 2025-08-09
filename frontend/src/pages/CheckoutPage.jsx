import { useCart } from '../store/cart';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { useState } from 'react';

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');

  async function placeOrder() {
    setError('');
    setLoading(true);
    try {
      const payload = { items: items.map(i => ({ productId: i.productId, qty: i.qty })) };
      const res = await api.post('/orders', payload);
      await api.post(`/orders/${res.data.order._id}/pay`);
      clear();
      navigate(`/payment-success?orderId=${res.data.order._id}`);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }

  if (!user) return <div className="alert alert-warning mt-6 max-w-md mx-auto">You must login first.</div>;
  if (!items.length) return <div className="alert alert-info mt-6 max-w-md mx-auto">No items in cart.</div>;

  return (
    <div className="max-w-md mx-auto pt-8">
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h1 className="card-title">Checkout</h1>
          <p className="text-sm opacity-70">
            This is a simulated payment. Clicking confirm will create and instantly pay your order.
          </p>
          {error && <div className="alert alert-error mt-3">
            <span>{error}</span>
          </div>}
          <button
            disabled={loading}
            onClick={placeOrder}
            className={`btn btn-primary mt-6 ${loading ? 'loading' : ''}`}
          >
            {loading ? 'Processing...' : 'Confirm & Pay'}
          </button>
        </div>
      </div>
    </div>
  );
}