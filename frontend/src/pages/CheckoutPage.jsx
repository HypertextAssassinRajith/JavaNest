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
      // Simulated immediate payment:
      await api.post(`/orders/${res.data.order._id}/pay`);
      clear();
      navigate(`/payment-success?orderId=${res.data.order._id}`);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }

  if (!user) return <p>You must login first.</p>;
  if (!items.length) return <p>No items in cart.</p>;

  return (
    <div className="max-w-md">
      <h1 className="text-xl font-bold mb-4">Checkout</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <p className="text-sm text-gray-600 mb-4">
        This is a simulated payment. Clicking the button will create an order and mark it paid.
      </p>
      <button
        disabled={loading}
        onClick={placeOrder}
        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded"
      >
        {loading ? 'Processing...' : 'Place Order & Pay'}
      </button>
    </div>
  );
}