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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="max-w-lg bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold">{product.title}</h1>
      <p className="mt-2 text-lg font-semibold">${product.price}</p>
      <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">
        {product.description || 'No description'}
      </p>
      <button
        onClick={() => add({ productId: product._id, title: product.title, price: product.price })}
        className="mt-5 bg-amber-700 hover:bg-amber-600 text-white px-4 py-2 rounded"
      >
        Add to Cart
      </button>
    </div>
  );
}