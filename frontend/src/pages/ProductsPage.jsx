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

  if (loading) return <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  if (error) return <div className="alert alert-error max-w-md mx-auto mt-6">
    <span>{error}</span>
  </div>;

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="text-sm opacity-70">{products.length} items</div>
      </div>
      {products.length === 0 && <p>No products yet.</p>}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map(p => (
          <div key={p._id} className="card bg-base-100 shadow hover:shadow-lg transition">
            <div className="card-body">
              <h2 className="card-title">
                {p.title}
                <div className="badge badge-secondary">${p.price?.toFixed(2)}</div>
              </h2>
              <p className="line-clamp-2 text-sm opacity-70">{p.description || 'No description'}</p>
              <div className="card-actions justify-end mt-4">
                <Link to={`/products/${p._id}`} className="btn btn-outline btn-primary btn-sm">
                  Details
                </Link>
                <button
                  onClick={() => add({ productId: p._id, title: p.title, price: p.price })}
                  className="btn btn-primary btn-sm"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}