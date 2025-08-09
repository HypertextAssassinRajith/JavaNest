import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../store/auth';

export default function AdminProductsPage() {
  const { user } = useAuth();
  const [products,setProducts] = useState([]);
  const [form,setForm] = useState({
    title:'', price:'', stock:'', description:''
  });
  const [error,setError] = useState('');
  const [loading,setLoading] = useState(false);

  async function load() {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(()=> { load(); }, []);

  if (user?.role !== 'admin') return <p>Forbidden</p>;

  async function createProduct() {
    setError('');
    setLoading(true);
    try {
      await api.post('/products', {
        title: form.title,
        price: parseFloat(form.price),
        stock: parseInt(form.stock) || 0,
        description: form.description
      });
      setForm({ title:'', price:'', stock:'', description:'' });
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Create failed');
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id) {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      await load();
    } catch (e) {
      alert(e.response?.data?.message || 'Delete failed');
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Admin Products</h1>
      <div className="mb-6 bg-white p-4 rounded shadow max-w-lg">
        <h2 className="font-semibold mb-2">Create Product</h2>
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <div className="grid gap-2">
          <input
            className="border p-2 rounded"
            placeholder="Title"
            value={form.title}
            onChange={e=>setForm(f=>({...f,title:e.target.value}))}
          />
          <input
            className="border p-2 rounded"
            placeholder="Price"
            value={form.price}
            onChange={e=>setForm(f=>({...f,price:e.target.value}))}
          />
          <input
            className="border p-2 rounded"
            placeholder="Stock"
            value={form.stock}
            onChange={e=>setForm(f=>({...f,stock:e.target.value}))}
          />
          <textarea
            className="border p-2 rounded"
            placeholder="Description"
            value={form.description}
            onChange={e=>setForm(f=>({...f,description:e.target.value}))}
          />
          <button
            disabled={loading}
            onClick={createProduct}
            className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white py-2 rounded"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
      <ul className="space-y-2">
        {products.map(p => (
          <li key={p._id} className="flex justify-between items-center bg-white p-3 rounded shadow">
            <div>
              <div className="font-semibold">{p.title}</div>
              <div className="text-xs text-gray-600">
                ${p.price} | Stock: {p.stock}
              </div>
            </div>
            <button
              onClick={() => deleteProduct(p._id)}
              className="text-red-600 text-sm"
            >
              Delete
            </button>
          </li>
        ))}
        {!products.length && <p>No products yet.</p>}
      </ul>
    </div>
  );
}