import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';
import { imageUrl } from '../../utils/imageUrl';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category_id: '' });
  const [image, setImage] = useState(null);

  const load = () => {
    Promise.all([api.get('/api/products'), api.get('/api/categories')]).then(([p, c]) => {
      setProducts(p.data.products || []);
      setCategories(c.data.categories || []);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (image) data.append('image', image);
    try {
      await api.post('/api/products', data);
      toast.success('Product added');
      setForm({ name: '', description: '', price: '', stock: '', category_id: '' });
      setImage(null);
      load();
    } catch {
      toast.error('Failed to add product');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/products/${id}`);
      toast.success('Product deleted');
      load();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-parchment">Manage products</h2>
        <p className="mt-2 text-parchment/70">Add Article and manage your catalog.</p>
      </div>
      <form onSubmit={handleSubmit} className="panel-dark grid gap-4 rounded-xl p-5 md:grid-cols-2">
        <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl border border-gold/25 bg-navy-950/60 px-4 py-3 text-parchment md:col-span-2" />
        <textarea required placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl border border-gold/25 bg-navy-950/60 px-4 py-3 text-parchment md:col-span-2" rows={3} />
        <input required type="number" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="rounded-xl border border-gold/25 bg-navy-950/60 px-4 py-3 text-parchment" />
        <input required type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="rounded-xl border border-gold/25 bg-navy-950/60 px-4 py-3 text-parchment" />
        <select required value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="rounded-xl border border-gold/25 bg-navy-950/60 px-4 py-3 text-parchment md:col-span-2">
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="text-parchment md:col-span-2" />
        <button type="submit" className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy-950 md:col-span-2">Add Article</button>
      </form>
      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.id} className="panel-dark flex items-center gap-4 rounded-lg px-4 py-3">
            <img src={imageUrl(product.image_url)} alt={product.name} className="h-14 w-14 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="text-parchment">{product.name}</p>
              <p className="text-sm text-gold">${Number(product.price).toFixed(2)} · Stock {product.stock}</p>
            </div>
            <button type="button" onClick={() => handleDelete(product.id)} className="text-sm text-red-400 hover:text-red-300">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
