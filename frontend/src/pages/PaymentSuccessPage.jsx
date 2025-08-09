import { useSearchParams, Link } from 'react-router-dom';

export default function PaymentSuccessPage() {
  const [sp] = useSearchParams();
  const orderId = sp.get('orderId');
  return (
    <div className="bg-white p-6 rounded shadow max-w-md">
      <h1 className="text-2xl font-bold text-green-700">Payment Successful</h1>
      <p className="mt-3 text-sm text-gray-700">Your order has been paid.</p>
      <p className="mt-1 text-xs text-gray-500">Order ID: {orderId}</p>
      <Link to="/" className="inline-block mt-5 text-blue-600 underline">
        Continue Shopping
      </Link>
    </div>
  );
}