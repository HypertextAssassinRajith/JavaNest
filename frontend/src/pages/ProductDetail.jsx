import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useCart } from '../store/cart';

export default function ProductDetail() {
  const { id } = useParams();
  const [product,setProduct] = useState();
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  const { add } = useCart();

  useEffect(()=> {
    setLoading(true);
    api.get(`/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(e => setError(e.response?.data?.message || 'Not found'))
      .finally(()=>setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-10"><span className="loading loading-bars loading-lg text-primary"></span></div>;
  if (error) return <div className="alert alert-error max-w-md mx-auto mt-6">
    <span>{error}</span>
  </div>;
  if (!product) return <p className="mt-6 text-center">Product not found.</p>;

  return (
    <div className="max-w-2xl mx-auto pt-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-4xl">{product.title}</h1>
          <div className="text-2xl font-semibold mt-2">${product.price}</div>
          <p className="mt-4 leading-relaxed whitespace-pre-line">{product.description || 'No description'}</p>
          <div className="card-actions justify-end mt-6">
            <button
              onClick={() => add({ productId: product._id, title: product.title, price: product.price })}
              className="btn btn-primary"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}