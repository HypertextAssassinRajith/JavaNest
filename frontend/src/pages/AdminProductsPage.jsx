import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../store/auth';

export default function AdminProductsPage() {
  const { user } = useAuth();
  const [products,setProducts] = useState([]);
  const [form,setForm] = useState({ title:'', price:'', stock:'', description:'' });
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

  if (user?.role !== 'admin') return <div className="alert alert-error mt-6 max-w-lg mx-auto">Forbidden</div>;

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
    <div className="pt-6">
      <h1 className="text-3xl font-bold mb-6">Admin Products</h1>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Create Product</h2>
            {error && <div className="alert alert-error py-2 text-sm">
              <span>{error}</span>
            </div>}
            <input
              className="input input-bordered w-full"
              placeholder="Title"
              value={form.title}
              onChange={e=>setForm(f=>({...f,title:e.target.value}))}
            />
            <div className="flex gap-3">
              <input
                className="input input-bordered w-1/2"
                placeholder="Price"
                value={form.price}
                onChange={e=>setForm(f=>({...f,price:e.target.value}))}
              />
              <input
                className="input input-bordered w-1/2"
                placeholder="Stock"
                value={form.stock}
                onChange={e=>setForm(f=>({...f,stock:e.target.value}))}
              />
            </div>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Description"
              value={form.description}
              onChange={e=>setForm(f=>({...f,description:e.target.value}))}
            />
            <button
              disabled={loading}
              onClick={createProduct}
              className={`btn btn-primary ${loading ? 'loading' : ''}`}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td>{p.title}</td>
                  <td>${p.price}</td>
                  <td>{p.stock}</td>
                  <td>
                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="btn btn-xs btn-error"
                    >
                      Del
                    </button>
                  </td>
                </tr>
              ))}
              {!products.length && (
                <tr><td colSpan="4" className="text-center opacity-70">No products</td></tr>
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}