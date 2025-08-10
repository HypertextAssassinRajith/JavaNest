import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Link } from 'react-router-dom';
import { useCart } from '../store/cart';
import Hero from '../components/Hero';

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

  return (
    <div>
      <Hero />
      <div id="shop" className="max-w-7xl mx-auto px-4 pb-20 pt-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold heading-font">Shop</h2>
          <div className="text-sm opacity-70">{products.length} items</div>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        )}
        {error && !loading && (
          <div className="alert alert-error max-w-md mx-auto mb-10">
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {products.map(p => (
              <div key={p._id} className="card bg-base-100 shadow-lg group hover:shadow-primary/30 transition">
                <figure className="h-44 bg-gradient-to-br from-neutral/20 to-neutral/5 w-full flex items-center justify-center relative overflow-hidden">
                  <span className="text-6xl opacity-10 group-hover:opacity-20 transition select-none">
                    ☕
                  </span>
                </figure>
                <div className="card-body">
                  <h3 className="card-title text-lg">
                    {p.title}
                    <span className="badge badge-secondary">${p.price?.toFixed(2)}</span>
                  </h3>
                  <p className="text-sm opacity-70 line-clamp-2 min-h-[2.5rem]">
                    {p.description || 'No description'}
                  </p>
                  <div className="card-actions justify-end mt-3">
                    <Link to={`/products/${p._id}`} className="btn btn-xs btn-outline">
                      Details
                    </Link>
                    <button
                      onClick={() => add({ productId: p._id, title: p.title, price: p.price })}
                      className="btn btn-xs btn-primary"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {!products.length && (
              <div className="col-span-full text-center opacity-70 py-10">
                No products available yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}