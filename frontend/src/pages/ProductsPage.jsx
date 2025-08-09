import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Link } from 'react-router-dom';
import { useCart } from '../store/cart';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');
  const { add } = useCart();

  useEffect(() => {
    setLoading(true);
    api.get('/products')
      .then(r => setProducts(r.data))
      .catch(e => setError(e.message || 'Error loading products'))
      .finally(()=>setLoading(false));
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p._id} className="border rounded p-4 bg-white shadow-sm">
            <h2 className="font-semibold">{p.title}</h2>
            <p className="text-sm text-gray-600">${p.price?.toFixed(2)}</p>
            <div className="mt-3 flex gap-2">
              <Link
                to={`/products/${p._id}`}
                className="text-blue-600 hover:underline text-sm"
              >
                View
              </Link>
              <button
                onClick={() =>
                  add({ productId: p._id, title: p.title, price: p.price })
                }
                className="bg-amber-700 text-white text-sm px-3 py-1 rounded hover:bg-amber-600"
              >
                Add
              </button>
            </div>
          </div>
        ))}
        {!products.length && <p>No products available</p>}
      </div>
    </div>
  );
}