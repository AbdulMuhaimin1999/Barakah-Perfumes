import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');

  const load = () => {
    api.get('/api/categories').then((res) => setCategories(res.data.categories || []));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/categories', { name });
      toast.success('Category added');
      setName('');
      load();
    } catch {
      toast.error('Failed to add category');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/categories/${id}`);
      toast.success('Category deleted');
      load();
    } catch {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-3xl text-parchment">Categories</h2>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-wrap gap-3">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          className="min-w-[280px] flex-1 rounded-xl border border-gold/25 bg-navy-900/60 px-4 py-3 text-parchment"
        />
        <button type="submit" className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy-950">Add</button>
      </form>
      <div className="mt-6 space-y-3">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between rounded-xl border border-gold/20 bg-navy-900/30 px-4 py-3">
            <span className="text-parchment">{category.name}</span>
            <button type="button" onClick={() => handleDelete(category.id)} className="text-sm text-red-400 hover:text-red-300">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
